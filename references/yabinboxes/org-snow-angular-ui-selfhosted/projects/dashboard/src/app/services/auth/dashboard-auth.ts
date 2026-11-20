import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { AuthUser } from '../../interfaces/model/auth-user.interface';
import { UserProfile } from '../../interfaces/model/user-profile.interface';
import { GithubAuth } from './github-auth';
import { GitlabAuth } from './gitlab-auth';

/**
 * The signed-in session, whether the user came from GitLab or GitHub.
 * Login buttons still call the provider service that starts the redirect.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardAuth {
  private readonly router = inject(Router);
  private readonly gitlab = inject(GitlabAuth);
  private readonly github = inject(GithubAuth);

  readonly currentUser = computed(() => this.active().currentUser());
  readonly isAuthenticated = computed(() => this.github.isAuthenticated() || this.gitlab.isAuthenticated());
  readonly isLoading = computed(() => this.gitlab.isLoading() || this.github.isLoading());
  readonly signInError = computed(() => this.github.signInError() || this.gitlab.signInError());

  signOut(): Observable<boolean> {
    this.gitlab.endSession();
    this.github.endSession();
    return from(this.router.navigate(['/login']));
  }

  getActor(user: AuthUser): string | null {
    return this.active().getActor(user);
  }

  getActorId(user: AuthUser): number | null {
    return this.active().getActorId(user);
  }

  getCurrentUserProfile(): UserProfile | null {
    return this.active().getCurrentUserProfile();
  }

  getAccessToken(): Observable<string | null> {
    return this.active().getAccessToken();
  }

  consumeStoredReturnUrl(): string {
    if (this.github.isAuthenticated()) {
      return this.github.consumeStoredReturnUrl();
    }
    return this.gitlab.consumeStoredReturnUrl();
  }

  setMockUser(email: string, displayName = 'Test User'): void {
    this.github.endSession();
    this.gitlab.setMockUser(email, displayName);
  }

  private active(): GitlabAuth | GithubAuth {
    if (this.github.isAuthenticated()) {
      return this.github;
    }
    return this.gitlab;
  }
}
