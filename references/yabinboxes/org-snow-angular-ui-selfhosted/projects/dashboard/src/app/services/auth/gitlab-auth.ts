import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { AuthUser } from '../../interfaces/model/auth-user.interface';
import { UserProfile } from '../../interfaces/model/user-profile.interface';
import { RuntimeConfig } from '../runtime-config';
import { clearActiveAuthProvider, readActiveAuthProvider, writeActiveAuthProvider } from './auth-session';

interface GitlabTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface GitlabApiUser {
  id: number;
  username: string;
  name: string;
  email?: string | null;
  avatar_url?: string | null;
}

interface GitlabSession {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
  user: AuthUser;
}

interface GitlabOauthTransaction {
  state: string;
  verifier: string;
  returnUrl: string;
}

const sessionKey = 'snow.gitlab.session';
const transactionKey = 'snow.gitlab.oauth';
const githubSessionKey = 'snow.github.session';

@Injectable({
  providedIn: 'root',
})
export class GitlabAuth {
  private readonly router = inject(Router);
  private readonly runtimeConfig = inject(RuntimeConfig);

  currentUser = signal<AuthUser | null>(null);
  isLoading = signal(true);
  isAuthenticated = signal(false);
  accessToken = signal<string | null>(null);
  signInError = signal<string | null>(null);

  /**
   * Restores a saved session or finishes the OAuth redirect.
   * Called before the first navigation so the guard sees the signed-in user.
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

      if (readActiveAuthProvider() === 'github') {
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
      console.error('GitLab sign-in failed:', error);
      this.signInError.set(error instanceof Error ? error.message : 'Failed to sign in with GitLab');
      this.clearSession();
    } finally {
      this.isLoading.set(false);
    }
  }

  signInWithGitlab(returnUrl = '/'): Observable<void> {
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
      providerId: user.providerData[0]?.providerId || 'gitlab.com',
      gitType: 'gitlab',
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
    const value = sessionStorage.getItem('snow.gitlab.returnUrl') || '/';
    sessionStorage.removeItem('snow.gitlab.returnUrl');
    return value;
  }

  setMockUser(email: string, displayName = 'Test User'): void {
    this.currentUser.set({
      uid: 'mock-test-001',
      email,
      displayName,
      photoURL: null,
      username: 'test-user',
      providerData: [{ providerId: 'mock', uid: 'mock-test-001' }],
    });
    this.isAuthenticated.set(true);
    this.isLoading.set(false);
  }

  private ownsCallback(state: string | null): boolean {
    const transaction = this.readTransaction();
    return !!transaction && !!state && transaction.state === state;
  }

  private async beginSignIn(returnUrl: string): Promise<void> {
    const gitlab = this.runtimeConfig.gitlab;
    if (!gitlab.clientId) {
      throw new Error('GitLab OAuth is not configured. Set gitlab.clientId in config.ts.');
    }

    const verifier = randomUrlSafe(64);
    const challenge = await sha256Base64Url(verifier);
    const state = randomUrlSafe(32);
    this.writeTransaction({ state, verifier, returnUrl });
    writeActiveAuthProvider('gitlab');
    localStorage.removeItem(githubSessionKey);

    const authorize = new URL('/oauth/authorize', `${gitlab.baseUrl}/`);
    authorize.searchParams.set('client_id', gitlab.clientId);
    authorize.searchParams.set('redirect_uri', this.runtimeConfig.gitlabRedirectUri());
    authorize.searchParams.set('response_type', 'code');
    authorize.searchParams.set('scope', gitlab.scopes);
    authorize.searchParams.set('state', state);
    authorize.searchParams.set('code_challenge', challenge);
    authorize.searchParams.set('code_challenge_method', 'S256');
    window.location.assign(authorize.toString());
  }

  private async finishSignIn(code: string, state: string | null): Promise<void> {
    const transaction = this.readTransaction();
    this.clearTransaction();
    if (!transaction || !state || transaction.state !== state) {
      throw new Error('GitLab sign-in state did not match. Start the login again.');
    }

    const tokens = await this.requestToken({
      grant_type: 'authorization_code',
      code,
      code_verifier: transaction.verifier,
      redirect_uri: this.runtimeConfig.gitlabRedirectUri(),
    });
    const user = await this.fetchUser(tokens.access_token);
    const session: GitlabSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      expiresAt: expiresAtFrom(tokens.expires_in),
      user,
    };
    this.writeSession(session);
    writeActiveAuthProvider('gitlab');
    localStorage.removeItem(githubSessionKey);
    sessionStorage.setItem('snow.gitlab.returnUrl', transaction.returnUrl);
    this.accessToken.set(session.accessToken);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  private async ensureAccessToken(session: GitlabSession): Promise<string | null> {
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
    const next: GitlabSession = {
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? session.refreshToken,
      expiresAt: expiresAtFrom(tokens.expires_in),
    };
    this.writeSession(next);
    this.accessToken.set(next.accessToken);
    return next.accessToken;
  }

  private async requestToken(fields: Record<string, string>): Promise<GitlabTokenResponse> {
    const gitlab = this.runtimeConfig.gitlab;
    const body = new URLSearchParams({
      client_id: gitlab.clientId,
      ...fields,
    });
    const response = await fetch(new URL('/oauth/token', `${gitlab.baseUrl}/`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const payload = await response.json().catch(() => ({})) as GitlabTokenResponse;
    if (!response.ok || !payload.access_token) {
      throw new Error(payload.error_description || payload.error || 'GitLab token request failed.');
    }
    return payload;
  }

  private async fetchUser(token: string): Promise<AuthUser> {
    const response = await fetch(new URL('/api/v4/user', `${this.runtimeConfig.gitlab.baseUrl}/`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error('GitLab did not return the signed-in user.');
    }
    const user = await response.json() as GitlabApiUser;
    const uid = String(user.id);
    return {
      uid,
      email: user.email ?? null,
      displayName: user.name || user.username,
      photoURL: user.avatar_url ?? null,
      username: user.username,
      providerData: [{ providerId: 'gitlab.com', uid }],
    };
  }

  private readSession(): GitlabSession | null {
    try {
      const raw = localStorage.getItem(sessionKey);
      if (!raw) return null;
      const session = JSON.parse(raw) as GitlabSession;
      if (!session.accessToken || !session.user) return null;
      return session;
    } catch {
      return null;
    }
  }

  private writeSession(session: GitlabSession): void {
    localStorage.setItem(sessionKey, JSON.stringify(session));
  }

  private clearSession(): void {
    localStorage.removeItem(sessionKey);
    this.accessToken.set(null);
  }

  private readTransaction(): GitlabOauthTransaction | null {
    try {
      const raw = sessionStorage.getItem(transactionKey);
      return raw ? JSON.parse(raw) as GitlabOauthTransaction : null;
    } catch {
      return null;
    }
  }

  private writeTransaction(transaction: GitlabOauthTransaction): void {
    sessionStorage.setItem(transactionKey, JSON.stringify(transaction));
  }

  private clearTransaction(): void {
    sessionStorage.removeItem(transactionKey);
  }
}

function expiresAtFrom(expiresIn: number | undefined): number {
  const seconds = expiresIn && expiresIn > 0 ? expiresIn : 7200;
  return Date.now() + seconds * 1000 - 60_000;
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
