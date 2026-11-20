import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfig } from '../runtime-config';

export interface FirstTimeFlagResponse {
  firstTimeFlag: number;
}

export interface FirstTimeSetup {
  auth: 'github' | 'gitlab';
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  hostBaseUrl: string;
}

export interface SelfHostedRecord {
  id: number;
  firstTimeFlag: number;
  auth: 'github' | 'gitlab';
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  hostBaseUrl: string;
}

export interface SelfHostedUpdate {
  auth?: 'github' | 'gitlab';
  baseUrl?: string;
  clientId?: string;
  redirectUri?: string;
  hostBaseUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SelfHostedApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RuntimeConfig);

  private get recordUrl(): string {
    return `${this.config.api.baseUrl}/connectors/self-hosted`;
  }

  private get firstTimeUrl(): string {
    return `${this.recordUrl}/first-time-flag`;
  }

  getRecord(): Observable<SelfHostedRecord> {
    return this.http.get<SelfHostedRecord>(this.recordUrl);
  }

  updateRecord(body: SelfHostedUpdate): Observable<SelfHostedRecord> {
    return this.http.put<SelfHostedRecord>(this.recordUrl, body);
  }

  getFirstTimeFlag(): Observable<FirstTimeFlagResponse> {
    return this.http.get<FirstTimeFlagResponse>(this.firstTimeUrl);
  }

  finishFirstTime(body: FirstTimeSetup): Observable<unknown> {
    return this.http.put(this.firstTimeUrl, body);
  }
}
