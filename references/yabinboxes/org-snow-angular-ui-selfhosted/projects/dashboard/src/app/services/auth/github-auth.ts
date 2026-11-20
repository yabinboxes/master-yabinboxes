import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { AuthUser } from '../../interfaces/model/auth-user.interface';
import { UserProfile } from '../../interfaces/model/user-profile.interface';
import { RuntimeConfig } from '../runtime-config';
import { clearActiveAuthProvider, readActiveAuthProvider, writeActiveAuthProvider } from './auth-session';

interface GithubTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface GithubApiUser {
  id: number;
  login: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}

interface GithubEmail {
  email?: string;
  primary?: boolean;
  verified?: boolean;
}

interface GithubSession {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
  user: AuthUser;
}

interface GithubOauthTransaction {
  state: string;
  verifier: string;
  returnUrl: string;
}

const sessionKey = 'snow.github.session';
const transactionKey = 'snow.github.oauth';
const returnUrlKey = 'snow.github.returnUrl';
const gitlabSessionKey = 'snow.gitlab.session';

@Injectable({
  providedIn: 'root',
})
export class GithubAuth {
  private readonly router = inject(Router);
  private readonly runtimeConfig = inject(RuntimeConfig);

  currentUser = signal<AuthUser | null>(null);
  isLoading = signal(true);
  isAuthenticated = signal(false);
  accessToken = signal<string | null>(null);
  signInError = signal<string | null>(null);

  /**
   * Restores a saved GitHub session or finishes a GitHub OAuth redirect.
   * Ignores a callback whose state belongs to another provider.
   */
  async restoreSession(): Promise<void> {
    try {
      const params = new URLSearchParams(window.location.search);
      const oauthError = params.get('error_description') || params.get('error');
      const code = params.get('code');
      const state = params.get('state');
      if ((oauthError || code) && !this.ownsCallback(state)) {
        return;
      }

      if (oauthError || code || state) {
        window.history.replaceState({}, '', window.location.pathname);
      }

      if (oauthError) {
        this.signInError.set(oauthError);
        this.endSession();
        return;
      }

      if (code) {
        await this.finishSignIn(code, state);
        return;
      }

      if (readActiveAuthProvider() !== 'github') {
        return;
      }

      const session = this.readSession();
      if (!session) {
        return;
      }

      const token = await this.ensureAccessToken(session);
      if (!token) {
        this.clearSession();
        return;
      }

      this.accessToken.set(token);
      this.currentUser.set(session.user);
      this.isAuthenticated.set(true);
    } catch (error) {
      console.error('GitHub sign-in failed:', error);
      this.signInError.set(error instanceof Error ? error.message : 'Failed to sign in with GitHub');
      this.clearSession();
    } finally {
      this.isLoading.set(false);
    }
  }

  signInWithGitHub(returnUrl = '/'): Observable<void> {
    return from(this.beginSignIn(returnUrl));
  }

  signOut(): Observable<boolean> {
    this.endSession();
    return from(this.router.navigate(['/login']));
  }

  endSession(): void {
    this.clearSession();
    this.clearTransaction();
    this.currentUser.set(null);
    this.accessToken.set(null);
    this.isAuthenticated.set(false);
    this.isLoading.set(false);
    clearActiveAuthProvider();
  }

  getActor(user: AuthUser): string | null {
    return user.username?.trim() || user.displayName?.trim() || null;
  }

  getActorId(user: AuthUser): number | null {
    const raw = user.providerData[0]?.uid || user.uid;
    const actorId = Number(raw);
    return Number.isFinite(actorId) ? actorId : null;
  }

  getCurrentUserProfile(): UserProfile | null {
    const user = this.currentUser();
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerData[0]?.providerId || 'github.com',
      gitType: 'github',
      actorId: this.getActorId(user),
      actor: this.getActor(user),
    };
  }

  getAccessToken(): Observable<string | null> {
    const session = this.readSession();
    if (!session) {
      return from(Promise.resolve(null));
    }
    return from(this.ensureAccessToken(session));
  }

  consumeStoredReturnUrl(): string {
    const value = sessionStorage.getItem(returnUrlKey) || '/';
    sessionStorage.removeItem(returnUrlKey);
    return value;
  }

  private ownsCallback(state: string | null): boolean {
    const transaction = this.readTransaction();
    return !!transaction && !!state && transaction.state === state;
  }

  private async beginSignIn(returnUrl: string): Promise<void> {
    const github = this.runtimeConfig.github;
    if (!github.clientId) {
      throw new Error('GitHub OAuth is not configured. Set github.clientId in config.ts.');
    }

    const verifier = randomUrlSafe(64);
    const challenge = await sha256Base64Url(verifier);
    const state = randomUrlSafe(32);
    this.writeTransaction({ state, verifier, returnUrl });
    writeActiveAuthProvider('github');
    localStorage.removeItem(gitlabSessionKey);

    const authorize = new URL('/login/oauth/authorize', `${github.baseUrl}/`);
    authorize.searchParams.set('client_id', github.clientId);
    authorize.searchParams.set('redirect_uri', this.runtimeConfig.githubRedirectUri());
    authorize.searchParams.set('scope', withUserEmailScope(github.scopes));
    authorize.searchParams.set('state', state);
    authorize.searchParams.set('code_challenge', challenge);
    authorize.searchParams.set('code_challenge_method', 'S256');
    window.location.assign(authorize.toString());
  }

  private async finishSignIn(code: string, state: string | null): Promise<void> {
    const transaction = this.readTransaction();
    this.clearTransaction();
    if (!transaction || !state || transaction.state !== state) {
      throw new Error('GitHub sign-in state did not match. Start the login again.');
    }

    const tokens = await this.requestToken({
      grant_type: 'authorization_code',
      code,
      code_verifier: transaction.verifier,
      redirect_uri: this.runtimeConfig.githubRedirectUri(),
    });
    const user = await this.fetchUser(tokens.access_token);
    const session: GithubSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      expiresAt: expiresAtFrom(tokens.expires_in),
      user,
    };
    this.writeSession(session);
    writeActiveAuthProvider('github');
    localStorage.removeItem(gitlabSessionKey);
    sessionStorage.setItem(returnUrlKey, transaction.returnUrl);
    this.accessToken.set(session.accessToken);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  private async ensureAccessToken(session: GithubSession): Promise<string | null> {
    if (session.expiresAt > Date.now()) {
      return session.accessToken;
    }
    if (!session.refreshToken) {
      return null;
    }
    const tokens = await this.requestToken({
      grant_type: 'refresh_token',
      refresh_token: session.refreshToken,
    });
    const next: GithubSession = {
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? session.refreshToken,
      expiresAt: expiresAtFrom(tokens.expires_in),
    };
    this.writeSession(next);
    this.accessToken.set(next.accessToken);
    return next.accessToken;
  }

  private async requestToken(fields: Record<string, string>): Promise<Required<Pick<GithubTokenResponse, 'access_token'>> & GithubTokenResponse> {
    const github = this.runtimeConfig.github;
    const body = new URLSearchParams({
      client_id: github.clientId,
      ...fields,
    });
    let response: Response;
    try {
      response = await fetch(new URL('/github-oauth/access_token', location.origin), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
    } catch {
      throw new Error('GitHub token request failed.');
    }
    const payload = await readTokenPayload(response);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('json') && !payload.access_token && !payload.error) {
      throw new Error('GitHub token proxy is not running. Restart ng serve and try again.');
    }
    if (!response.ok || !payload.access_token) {
      const detail = payload.error_description || payload.error;
      if (
        detail === 'incorrect_client_credentials' ||
        detail === 'The client_id and/or client_secret passed are incorrect.'
      ) {
        throw new Error('GitHub rejected the client id or client secret. Use the client secret from the same OAuth app, save it in github.client-secret, and restart ng serve.');
      }
      throw new Error(detail || 'GitHub token request failed.');
    }
    return payload as Required<Pick<GithubTokenResponse, 'access_token'>> & GithubTokenResponse;
  }

  private async fetchUser(token: string): Promise<AuthUser> {
    const response = await fetch(githubUserUrl(this.runtimeConfig.github.baseUrl), {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!response.ok) {
      throw new Error('GitHub did not return the signed-in user.');
    }
    const user = await response.json() as GithubApiUser;
    const uid = String(user.id);
    const email = await this.fetchPrimaryEmail(token) ?? user.email ?? null;
    return {
      uid,
      email,
      displayName: user.name || user.login,
      photoURL: user.avatar_url ?? null,
      username: user.login,
      providerData: [{ providerId: 'github.com', uid }],
    };
  }

  private async fetchPrimaryEmail(token: string): Promise<string | null> {
    const response = await fetch(githubEmailsUrl(this.runtimeConfig.github.baseUrl), {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!response.ok) return null;
    const emails = await response.json() as GithubEmail[];
    if (!Array.isArray(emails)) return null;
    const primary = emails.find((item) => item.primary && item.verified && item.email)
      ?? emails.find((item) => item.verified && item.email)
      ?? emails.find((item) => item.email);
    return primary?.email ?? null;
  }

  private readSession(): GithubSession | null {
    try {
      const raw = localStorage.getItem(sessionKey);
      if (!raw) return null;
      const session = JSON.parse(raw) as GithubSession;
      if (!session.accessToken || !session.user) return null;
      return session;
    } catch {
      return null;
    }
  }

  private writeSession(session: GithubSession): void {
    localStorage.setItem(sessionKey, JSON.stringify(session));
  }

  private clearSession(): void {
    localStorage.removeItem(sessionKey);
    this.accessToken.set(null);
  }

  private readTransaction(): GithubOauthTransaction | null {
    try {
      const raw = sessionStorage.getItem(transactionKey);
      return raw ? JSON.parse(raw) as GithubOauthTransaction : null;
    } catch {
      return null;
    }
  }

  private writeTransaction(transaction: GithubOauthTransaction): void {
    sessionStorage.setItem(transactionKey, JSON.stringify(transaction));
  }

  private clearTransaction(): void {
    sessionStorage.removeItem(transactionKey);
  }
}

function githubUserUrl(baseUrl: string): string {
  return githubApiUrl(baseUrl, '/user');
}

function githubEmailsUrl(baseUrl: string): string {
  return githubApiUrl(baseUrl, '/user/emails');
}

function githubApiUrl(baseUrl: string, path: string): string {
  const host = new URL(baseUrl).hostname;
  if (host === 'github.com' || host === 'www.github.com') {
    return `https://api.github.com${path}`;
  }
  return new URL(`/api/v3${path}`, `${baseUrl}/`).href;
}

function withUserEmailScope(scopes: string): string {
  const parts = scopes.split(/\s+/).filter(Boolean);
  if (!parts.includes('user:email')) {
    parts.push('user:email');
  }
  return parts.join(' ');
}

async function readTokenPayload(response: Response): Promise<GithubTokenResponse> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as GithubTokenResponse;
  } catch {
    const params = new URLSearchParams(text);
    const expiresIn = params.get('expires_in');
    return {
      access_token: params.get('access_token') ?? undefined,
      refresh_token: params.get('refresh_token') ?? undefined,
      expires_in: expiresIn ? Number(expiresIn) : undefined,
      error: params.get('error') ?? undefined,
      error_description: params.get('error_description') ?? undefined,
    };
  }
}

function expiresAtFrom(expiresIn: number | undefined): number {
  if (!expiresIn || expiresIn <= 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Date.now() + expiresIn * 1000 - 60_000;
}

function randomUrlSafe(size: number): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function sha256Base64Url(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return base64Url(new Uint8Array(digest));
}

function base64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
