import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LicenseType } from '../../interfaces/model/license.interface';
import {
  UpdateLicenseRequest,
  PipelineSnowTokenResponse,
  PipelineSnowTokenIdentity,
  GetProfileRequest,
} from '../../interfaces/api/api-profile.interface';
import { APIProfileResponse } from '../../interfaces/api/api-deployment.interface';
import { RuntimeConfig } from '../runtime-config';

@Injectable({
  providedIn: 'root',
})
export class HandleProfilesApi {
  // Centralized API wrapper for profile/License/Token endpoints.
  private readonly http = inject(HttpClient);
  private readonly config = inject(RuntimeConfig);
  private get baseUrl(): string {
    return this.config.url('profile');
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Update user license via PUT request
   * @param license The license type to update
   * @param email The user's email address
   * @returns Observable with the API response
   */
  updateLicense(license: LicenseType, email?: string): Observable<UpdateLicenseRequest> {
    if (!license || license === 'empty') {
      return throwError(() => new Error('Invalid license type'));
    }

    const url = this.config.url('profileLicense');
    const body: UpdateLicenseRequest = { license, email };

    return this.http.put<UpdateLicenseRequest>(url, body).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get pipeline snow token via GET request
   * @param identity GitHub actorId and gitType
   * @returns Observable with the pipeline snow token response
   */
  getPipelineSnowToken(
    identity: PipelineSnowTokenIdentity
  ): Observable<PipelineSnowTokenResponse> {
    const url = this.config.url('profileToken');
    const params = new HttpParams()
      .set('actorId', String(identity.actorId))
      .set('gitType', identity.gitType);

    return this.http.get<PipelineSnowTokenResponse>(url, { params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Regenerate pipeline snow token via PUT request
   * @param identity GitHub actorId and gitType (query parameters)
   * @returns Observable with the regenerated pipeline snow token response
   */
  regeneratePipelineSnowToken(
    identity: PipelineSnowTokenIdentity
  ): Observable<PipelineSnowTokenResponse> {
    const url = this.config.url('profileToken');
    const params = new HttpParams()
      .set('actorId', String(identity.actorId))
      .set('gitType', identity.gitType);

    return this.http.put<PipelineSnowTokenResponse>(url, null, { params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get profile data via POST request
   * @param email The user's email address
   * @param options Optional GitHub identity fields from OAuth profile
   * @returns Observable with the API response
   */
  getProfile(
    email: string,
    options?: {
      actorId?: number | string | null;
      actor?: string | null;
      gitType?: string;
    }
  ): Observable<APIProfileResponse> {
    const body: GetProfileRequest = { email };
    if (options?.actorId != null && options.actorId !== '') {
      body.actorId = String(options.actorId);
    }
    if (options?.actor) {
      body.actor = options.actor;
    }
    if (options?.gitType) {
      body.gitType = options.gitType;
    }
    console.log('Get profile API request:', { url: this.baseUrl, body });
    return this.http.post<APIProfileResponse>(this.baseUrl, body).pipe(
      tap((response) => console.log('Get profile API response:', response)),
      catchError(this.handleError.bind(this))
    );
  }
}
