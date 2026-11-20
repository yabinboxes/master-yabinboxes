import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { HandleProfiles } from '../../services/handlers/handle-profiles';
// import { HandleTabs } from '../../services/handlers/handle-tabs'; // TABS DISABLED
import { LicenseType } from '../../interfaces/model/license.interface';
import { DashboardAuth } from '../../services/auth/dashboard-auth';
import { filter, take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { HandleProfilesApi } from '../../services/actions-api/handle-profiles.api';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class Dashboard implements OnInit {
  private profilesService = inject(HandleProfiles);
  private authService = inject(DashboardAuth);
  private router = inject(Router);
  private profilesApi = inject(HandleProfilesApi);
  private destroyRef = inject(DestroyRef);
  // private handleTabs = inject(HandleTabs); // TABS DISABLED
  private profileEmail = signal<string | null>(null);
  private isMockMode = signal(false);
  readonly isAuthenticated = this.authService.isAuthenticated;

  private profileQuery = injectQuery(() => ({
    queryKey: ['profile', this.profileEmail()],
    queryFn: () => {
      const email = this.profileEmail() as string;
      const profile = this.profilesService.profile;
      return lastValueFrom(
        this.profilesApi.getProfile(email, {
          actorId: profile?.actorId ?? undefined,
          actor: profile?.actor ?? undefined,
          gitType: profile?.gitType ?? 'gitlab',
        })
      );
    },
    enabled: !!this.profileEmail(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  }));

  /** True when profile has been retrieved; only then show sources (router-outlet). */
  readonly profileAndTabsReady = computed(() => {
    if (this.isMockMode()) return true;
    const profileDone = !this.profileQuery.isPending();
    // TABS DISABLED — previously also waited for tabs:
    // const tabsDone = !this.handleTabs.tabsLoading();
    // return profileDone && tabsDone;
    return profileDone;
  });

  constructor() {
    effect(() => {
      const response = this.profileQuery.data();
      if (!response) return;

      console.log('Profile API response:', response);

      // Update license from response
      if (response.license) {
        const licenseValue = response.license.toLowerCase() as LicenseType;
        if (
          ['self', 'individual', 'business'].includes(licenseValue) &&
          this.profilesService.license !== licenseValue
        ) {
          this.profilesService.license = licenseValue;
          console.log('License set from API:', this.profilesService.license);
        }
      }

      // Update org from response
      if (response.org && this.profilesService.org !== response.org) {
        this.profilesService.org = response.org;
        console.log('Org set from API:', this.profilesService.org);
      }

      const currentProfile = this.profilesService.profile;
      if (currentProfile) {
        const parsedActorId = response.actorId != null && response.actorId !== ''
          ? Number(response.actorId)
          : null;
        const nextActorId = parsedActorId != null && Number.isFinite(parsedActorId)
          ? parsedActorId
          : currentProfile.actorId;
        const nextGitType = response.gitType || currentProfile.gitType;
        const nextActor = response.actor || currentProfile.actor;
        if (
          nextGitType !== currentProfile.gitType ||
          nextActor !== currentProfile.actor ||
          nextActorId !== currentProfile.actorId
        ) {
          this.profilesService.profile = {
            ...currentProfile,
            gitType: nextGitType,
            actor: nextActor,
            actorId: nextActorId,
          };
        }
      }
    });

    effect(() => {
      const error = this.profileQuery.error();
      if (error) {
        console.error('Profile API error:', error);
      }
    });
  }

  ngOnInit() {
    if (this.router.url.startsWith('/dashboard-test')) {
      this.setupMockProfile();
      return;
    }

    // Wait for auth loading to complete if still loading
    if (this.authService.isLoading()) {
      timer(0, 50).pipe(
        filter(() => !this.authService.isLoading()),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.validateAuth();
      });
    } else {
      this.validateAuth();
    }
  }

  private setupMockProfile(): void {
    const mockEmail = 'test@snow-test.dev';
    this.authService.setMockUser(mockEmail);
    this.profilesService.profile = {
      uid: 'mock-test-001',
      email: mockEmail,
      displayName: 'Test User',
      photoURL: null,
      providerId: 'mock',
      gitType: 'gitlab',
    };
    this.profilesService.license = 'individual';
    this.profilesService.org = 'mock-org';
    this.isMockMode.set(true);
  }

  private validateAuth() {
    if (!this.authService.isAuthenticated()) {
      console.warn('User is not authenticated. Redirecting to login...');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // User is authenticated, set profile from the GitLab session
    const userProfile = this.authService.getCurrentUserProfile();
    if (userProfile) {
      this.profilesService.profile = userProfile;
      console.log('Profile set in dashboard:', userProfile);

      // Trigger profile API query to get license and org
      if (userProfile.email) {
        this.profileEmail.set(userProfile.email);
      }
    }
  }
}
