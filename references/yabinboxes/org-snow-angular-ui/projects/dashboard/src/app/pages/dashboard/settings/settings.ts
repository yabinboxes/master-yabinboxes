import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Copy, RefreshCw, Crown, User, Building2, ExternalLink, Edit } from 'lucide-angular';
import { FirebaseAuth } from '../../../services/auth/firebase-auth';
import { HandleProfiles } from '../../../services/handlers/handle-profiles';
import { LicenseType } from '../../../interfaces/model/license.interface';
import { HandleProfilesApi } from '../../../services/actions-api/handle-profiles.api';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './settings.html'
})
export default class Settings {
  protected authService = inject(FirebaseAuth);
  protected profilesService = inject(HandleProfiles);
  private profilesApi = inject(HandleProfilesApi);
  private destroyRef = inject(DestroyRef);
  private pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    // Store the original license when component initializes
    this.originalLicense.set(this.profilesService.license);
    this.destroyRef.onDestroy(() => this.clearPendingTimeouts());
  }
  
  readonly copyIcon = Copy;
  readonly refreshIcon = RefreshCw;
  readonly crownIcon = Crown;
  readonly userIcon = User;
  readonly buildingIcon = Building2;
  readonly externalLinkIcon = ExternalLink;
  readonly editIcon = Edit;
  
  isTokenVisible = signal(false);
  copySuccess = signal(false);
  isUpdatingLicense = signal(false);
  licenseUpdateError = signal<string | null>(null);
  licenseUpdateSuccess = signal(false);
  isRegeneratingToken = signal(false);
  tokenRegenerateError = signal<string | null>(null);
  tokenRegenerateSuccess = signal(false);
  isFetchingToken = signal(false);
  tokenFetchError = signal<string | null>(null);
  private originalLicense = signal<LicenseType | null>(null);

  private scheduleClear(callback: () => void, delayMs: number): void {
    const timeoutId = setTimeout(() => {
      this.pendingTimeouts.delete(timeoutId);
      callback();
    }, delayMs);
    this.pendingTimeouts.add(timeoutId);
  }

  private clearPendingTimeouts(): void {
    for (const timeoutId of this.pendingTimeouts) {
      clearTimeout(timeoutId);
    }
    this.pendingTimeouts.clear();
  }

  getCurrentUser() {
    return this.authService.currentUser();
  }

  getLicense() {
    return this.profilesService.license;
  }

  getProviderName(): string {
    const user = this.getCurrentUser();
    if (!user?.providerData || user.providerData.length === 0) {
      return 'Unknown';
    }
    const providerId = user.providerData[0]?.providerId;
    if (providerId === 'github.com') return 'GitHub';
    if (providerId === 'google.com') return 'Google';
    return providerId || 'Unknown';
  }

  getPipelineToken(): string {
    return this.profilesService.pipelineSnowToken || '';
  }

  /** True when a pipeline token is already loaded in the profile service. */
  hasPipelineToken(): boolean {
    return !!this.profilesService.pipelineSnowToken;
  }

  /** Button label: hint when empty, masked value when token is loaded. */
  getTokenButtonLabel(): string {
    if (!this.hasPipelineToken()) {
      return 'Click to copy token';
    }
    const token = this.profilesService.pipelineSnowToken;
    return '•'.repeat(Math.min(token.length, 40));
  }

  private getTokenIdentity(): { actorId: number; gitType: string } | null {
    const profile = this.profilesService.profile;
    let actorId = profile?.actorId ?? null;
    if (actorId == null) {
      const user = this.authService.currentUser();
      actorId = user ? this.authService.getGithubActorId(user) : null;
    }
    if (actorId == null) {
      return null;
    }
    return {
      actorId,
      gitType: profile?.gitType || 'github',
    };
  }

  /**
   * Normalize GET/PUT response body to a token string.
   * Prefers non-empty known fields; never returns "" if another field holds the token.
   */
  private extractPipelineToken(response: unknown): string {
    if (response == null) {
      return '';
    }
    if (typeof response === 'string') {
      return response;
    }
    if (typeof response !== 'object') {
      return String(response);
    }

    const body = response as Record<string, unknown>;
    const preferredKeys = [
      'token',
      'Token',
      'snowToken',
      'snow_token',
      'pipelineSnowToken',
      'pipeline_token',
      'pipelineToken',
      'data',
      'result',
      'value',
      'payload',
      'body',
    ];

    for (const key of preferredKeys) {
      const value = body[key];
      if (typeof value === 'string' && value !== '') {
        return value;
      }
      if (value != null && typeof value === 'object') {
        const nested = this.extractPipelineToken(value);
        if (nested !== '') {
          return nested;
        }
      }
    }

    // Last resort: first non-empty string value on the object
    for (const value of Object.values(body)) {
      if (typeof value === 'string' && value !== '') {
        return value;
      }
    }

    // Explicit empty token field (or nothing usable)
    if (typeof body['token'] === 'string') {
      return body['token'];
    }
    return '';
  }

  private hasNonEmptyToken(token: string | null | undefined): boolean {
    return typeof token === 'string' && token.length > 0;
  }

  private writeTokenToClipboard(token: string): void {
    this.profilesService.pipelineSnowToken = token;
    navigator.clipboard.writeText(token).then(() => {
      this.copySuccess.set(true);
      this.scheduleClear(() => {
        this.copySuccess.set(false);
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy token:', err);
      this.tokenFetchError.set('Failed to copy token to clipboard');
      this.scheduleClear(() => {
        this.tokenFetchError.set(null);
      }, 3000);
    });
  }

  private generateAndCopyToken(identity: { actorId: number; gitType: string }): void {
    this.profilesApi.regeneratePipelineSnowToken(identity).subscribe({
      next: (response) => {
        this.isFetchingToken.set(false);
        const token = this.extractPipelineToken(response);
        if (!this.hasNonEmptyToken(token)) {
          this.tokenFetchError.set('No token found in response');
          this.scheduleClear(() => {
            this.tokenFetchError.set(null);
          }, 3000);
          return;
        }
        this.writeTokenToClipboard(token);
      },
      error: (error) => {
        console.error('Failed to generate token:', error);
        this.isFetchingToken.set(false);
        this.tokenFetchError.set(error?.message || 'Failed to generate token. Please try again.');
        this.scheduleClear(() => {
          this.tokenFetchError.set(null);
        }, 5000);
      },
    });
  }

  copyToken() {
    const identity = this.getTokenIdentity();

    if (!identity) {
      this.tokenFetchError.set('GitHub actorId is required to get token');
      this.scheduleClear(() => {
        this.tokenFetchError.set(null);
      }, 3000);
      return;
    }

    // Use local token if already loaded — never hit the API
    const localToken = this.profilesService.pipelineSnowToken;
    if (this.hasNonEmptyToken(localToken)) {
      navigator.clipboard.writeText(localToken).then(() => {
        this.copySuccess.set(true);
        this.scheduleClear(() => {
          this.copySuccess.set(false);
        }, 2000);
      }).catch((err) => {
        console.error('Failed to copy token:', err);
      });
      return;
    }

    // 1) GET always first
    // 2) PUT only if GET succeeds AND token is empty string ("")
    // 3) PUT never runs on GET error or when GET returns a non-empty token
    this.isFetchingToken.set(true);
    this.tokenFetchError.set(null);
    this.copySuccess.set(false);

    this.profilesApi.getPipelineSnowToken(identity).subscribe({
      next: (response) => {
        const token = this.extractPipelineToken(response);

        if (this.hasNonEmptyToken(token)) {
          this.isFetchingToken.set(false);
          this.writeTokenToClipboard(token);
          // Must return here so PUT is never invoked after a non-empty GET token
          return;
        }

        // GET succeeded with empty token only → generate
        if (token === '') {
          this.generateAndCopyToken(identity);
          return;
        }

        this.isFetchingToken.set(false);
        this.tokenFetchError.set('Unexpected empty token from server');
        this.scheduleClear(() => {
          this.tokenFetchError.set(null);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to fetch token:', error);
        this.isFetchingToken.set(false);
        this.tokenFetchError.set(error?.message || 'Failed to fetch token. Please try again.');
        this.scheduleClear(() => {
          this.tokenFetchError.set(null);
        }, 5000);
      },
    });
  }

  regenerateToken() {
    const identity = this.getTokenIdentity();

    if (!identity) {
      this.tokenRegenerateError.set('GitHub actorId is required to regenerate token');
      return;
    }

    this.isRegeneratingToken.set(true);
    this.tokenRegenerateError.set(null);
    this.tokenRegenerateSuccess.set(false);
    this.isTokenVisible.set(false);
    this.copySuccess.set(false);

    this.profilesApi.regeneratePipelineSnowToken(identity).subscribe({
      next: (response) => {
        console.log('Token regenerated successfully:', response);
        this.isRegeneratingToken.set(false);
        this.tokenRegenerateSuccess.set(true);

        const token = this.extractPipelineToken(response);
        if (token !== '') {
          this.profilesService.pipelineSnowToken = token;
        }

        this.scheduleClear(() => {
          this.tokenRegenerateSuccess.set(false);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to regenerate token:', error);
        this.isRegeneratingToken.set(false);
        this.tokenRegenerateError.set(error?.message || 'Failed to regenerate token. Please try again.');

        this.scheduleClear(() => {
          this.tokenRegenerateError.set(null);
        }, 5000);
      },
    });
  }

  getLicenseDisplayName(): string {
    const license = this.getLicense();
    switch (license) {
      case 'self':
        return 'Self';
      case 'individual':
        return 'Individual';
      case 'business':
        return 'Business';
      default:
        return 'No license';
    }
  }

  getLicenseDescription(): string {
    const license = this.getLicense();
    switch (license) {
      case 'self':
        return 'Personal use license for individual developers';
      case 'individual':
        return 'Individual membership with extended features';
      case 'business':
        return 'Business license with full enterprise features';
      default:
        return '';
    }
  }

  getLicenseIcon() {
    const license = this.getLicense();
    switch (license) {
      case 'self':
        return this.userIcon;
      case 'individual':
        return this.userIcon;
      case 'business':
        return this.buildingIcon;
      default:
        return this.userIcon;
    }
  }

  getLicenseBadgeClass(): string {
    const license = this.getLicense();
    switch (license) {
      case 'self':
        return 'badge-neutral';
      case 'individual':
        return 'badge-primary';
      case 'business':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  }

  updateLicense(newLicense: LicenseType) {
    // Update local state immediately for UI responsiveness
    this.profilesService.license = newLicense;
  }

  /**
   * Save the current license to the API
   */
  saveLicenseToApi() {
    const currentLicense = this.getLicense();
    if (!currentLicense || currentLicense === 'empty') {
      this.licenseUpdateError.set('Invalid license type');
      return;
    }

    const currentUser = this.getCurrentUser();
    const userEmail = currentUser?.email;
    
    if (!userEmail) {
      this.licenseUpdateError.set('User email is required to update license');
      return;
    }

    this.isUpdatingLicense.set(true);
    this.licenseUpdateError.set(null);
    this.licenseUpdateSuccess.set(false);

    this.profilesApi.updateLicense(currentLicense, userEmail).subscribe({
      next: (response) => {
        console.log('License updated successfully:', response);
        this.isUpdatingLicense.set(false);
        this.licenseUpdateSuccess.set(true);
        
        // Update the original license to match the saved one
        this.originalLicense.set(currentLicense);
        
        this.scheduleClear(() => {
          this.licenseUpdateSuccess.set(false);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to update license:', error);
        this.isUpdatingLicense.set(false);
        this.licenseUpdateError.set(error?.message || 'Failed to update license. Please try again.');
        
        this.scheduleClear(() => {
          this.licenseUpdateError.set(null);
        }, 5000);
      }
    });
  }

  getLicensePageRoute(): string {
    const license = this.getLicense();
    switch (license) {
      case 'self':
        return '/self-license';
      case 'individual':
        return '/individual-license';
      case 'business':
        return '/business-license'; // Assuming this route exists or will exist
      default:
        return '/self-license';
    }
  }

  scrollToLicenseOptions() {
    const element = document.getElementById('license-options');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add a slight highlight effect
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      this.scheduleClear(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 2000);
    }
  }

  /**
   * Check if current license matches the original profile license
   * @returns true if license is the same as original, false otherwise
   */
  isLicenseSameAsProfile(): boolean {
    const currentLicense = this.getLicense();
    const original = this.originalLicense();
    if (original === null) {
      return false;
    }
    return currentLicense === original;
  }

  /**
   * Computed signal to check if license has changed from original
   * This ensures reactivity in the template - shows Save button only when license differs from original
   */
  readonly hasLicenseChanged = computed(() => {
    const currentLicense = this.profilesService.license;
    const original = this.originalLicense();
    if (original === null) {
      // If no original license, show button if current license is not empty
      return currentLicense !== 'empty';
    }
    // Show button if current license is different from original
    return currentLicense !== original;
  });
}
