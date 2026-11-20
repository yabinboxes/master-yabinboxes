import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserProfile } from '../../interfaces/model/user-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuth {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  // Auth state signals
  currentUser = signal<User | null>(null);
  isLoading = signal(true);
  isAuthenticated = signal(false);
  githubAccessToken = signal<string | null>(null);

  constructor() {
    // Single source of truth for auth state across the app.
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
      this.isLoading.set(false);
    });
  }

  /**
   * Sign in with GitHub
   * @returns Observable with the authenticated user
   * @throws Error if sign-in fails
   */
  signInWithGitHub(): Observable<User> {
    const provider = new GithubAuthProvider();
    // Private and org-internal repos require these classic OAuth scopes.
    provider.addScope('repo');
    provider.addScope('read:org');
    return from(signInWithPopup(this.auth, provider)).pipe(
      map((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        this.githubAccessToken.set(credential?.accessToken ?? null);
        return result.user;
      }),
      catchError((error) => {
        console.error('GitHub sign-in error:', error);
        return throwError(() => new Error(error.message || 'Failed to sign in with GitHub'));
      })
    );
  }

  /**
   * Sign in with Google
   * @returns Observable with the authenticated user
   * @throws Error if sign-in fails
   */
  signInWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      map((result) => result.user),
      catchError((error) => {
        console.error('Google sign-in error:', error);
        return throwError(() => new Error(error.message || 'Failed to sign in with Google'));
      })
    );
  }

  /**
   * Sign out the current user
   * @returns Observable that completes when sign-out is successful
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.githubAccessToken.set(null);
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Sign out error:', error);
        return throwError(() => new Error(error.message || 'Failed to sign out'));
      })
    );
  }

  /**
   * GitHub username (github.actor equivalent) from Firebase user data.
   */
  getGithubActor(user: User): string | null {
    const screenName = (
      user as { reloadUserInfo?: { screenName?: string } }
    ).reloadUserInfo?.screenName;
    const actor = screenName || user.displayName;
    return actor?.trim() || null;
  }

  /**
   * GitHub numeric user id (github.actor_id equivalent) from Firebase provider data.
   */
  getGithubActorId(user: User): number | null {
    const githubProvider = user.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );
    if (!githubProvider?.uid) {
      return null;
    }

    const actorId = Number(githubProvider.uid);
    return Number.isFinite(actorId) ? actorId : null;
  }

  /**
   * Get current user profile
   */
  getCurrentUserProfile(): UserProfile | null {
    const user = this.currentUser();
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerData[0]?.providerId || 'unknown',
      gitType: 'github',
      actorId: this.getGithubActorId(user),
      actor: this.getGithubActor(user),
    };
  }

  /**
   * Inject a mock user for test/preview routes — bypasses Firebase auth entirely.
   */
  setMockUser(email: string, displayName: string = 'Test User'): void {
    const mock = { uid: 'mock-test-001', email, displayName, photoURL: null, providerData: [{ providerId: 'mock' }] } as unknown as User;
    this.currentUser.set(mock);
    this.isAuthenticated.set(true);
    this.isLoading.set(false);
  }

  /**
   * Firebase ID token for API Authorization headers.
   * @param forceRefresh When true, forces a token refresh before returning.
   */
  getIdToken(forceRefresh = false): Observable<string | null> {
    const user = this.currentUser();
    if (!user || typeof user.getIdToken !== 'function') {
      return of(null);
    }
    return from(user.getIdToken(forceRefresh)).pipe(
      catchError((error) => {
        console.error('Failed to get Firebase ID token:', error);
        return of(null);
      })
    );
  }

  /**
   * Get current user as Observable
   */
  getCurrentUser$(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
      return unsubscribe;
    });
  }
}
