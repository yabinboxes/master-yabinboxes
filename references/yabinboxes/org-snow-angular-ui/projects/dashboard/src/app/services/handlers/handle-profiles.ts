import { Injectable, signal, inject } from '@angular/core';
import { UserProfile } from '../../interfaces/model/user-profile.interface';
import { LicenseType } from '../../interfaces/model/license.interface';
import { HandleProfilesApi } from '../actions-api/handle-profiles.api';

@Injectable({
  providedIn: 'root',
})
export class HandleProfiles {
  private readonly _profile = signal<UserProfile | null>(null);
  private readonly _license = signal<LicenseType>('empty');
  private readonly _pipelineSnowToken = signal<string>('');
  private readonly _org = signal<string>('empty');
  private readonly profilesApi = inject(HandleProfilesApi);

  /**
   * Readonly signals for reactive access
   */
  readonly profileSignal = this._profile.asReadonly();
  readonly licenseSignal = this._license.asReadonly();
  readonly pipelineSnowTokenSignal = this._pipelineSnowToken.asReadonly();
  readonly orgSignal = this._org.asReadonly();

  /**
   * Get the current pipeline snow token
   */
  get pipelineSnowToken(): string {
    return this._pipelineSnowToken();
  }

  set pipelineSnowToken(value: string) {
    this._pipelineSnowToken.set(value);
  }

  /**
   * Get the current license
   */
  get license(): LicenseType {
    return this._license();
  }

  /**
   * Set the license
   */
  set license(value: LicenseType) {
    this._license.set(value);
  }

  /**
   * Get the current org
   */
  get org(): string {
    return this._org();
  }

  /**
   * Set the org
   */
  set org(value: string) {
    this._org.set(value);
  }

  /**
   * Get the current profile
   */
  get profile(): UserProfile | null {
    return this._profile();
  }

  /**
   * Set the profile
   */
  set profile(value: UserProfile | null) {
    this._profile.set(value);
  }

  /**
   * Regenerate the pipeline snow token via API call
   * @param identity GitHub actorId and gitType
   * @returns Observable with the regenerated token response
   */
  regenerateToken(identity: { actorId: number; gitType: string }) {
    return this.profilesApi.regeneratePipelineSnowToken(identity);
  }

  /**
   * Reset all profile data (useful for logout)
   */
  reset(): void {
    this._profile.set(null);
    this._license.set('empty');
    this._pipelineSnowToken.set('');
    this._org.set('empty');
  }
}
