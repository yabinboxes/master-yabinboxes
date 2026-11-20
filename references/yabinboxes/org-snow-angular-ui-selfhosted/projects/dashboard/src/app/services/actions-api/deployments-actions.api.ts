import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { APISnowDeploymentResponse } from '../../interfaces/api/api-deployment.interface';
import { RuntimeConfig } from '../runtime-config';

@Injectable({
  providedIn: 'root',
})
export class DeploymentsActionsApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RuntimeConfig);

  fetchSnowDeployments(): Observable<APISnowDeploymentResponse[]> {
    return this.http.get<APISnowDeploymentResponse[]>(
      this.config.url('snowDeployments')
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] fetchSnowDeployments failed:', err);
        return throwError(() => err);
      })
    );
  }

  updateDeploymentColor(sourceId: string, color: string): Observable<unknown> {
    const params = new HttpParams().set('color', color || 'nocolor');
    return this.http.put(
      `${this.config.api.baseUrl}/connectors/publish-snow-deployment/color/${sourceId}`,
      {},
      { params }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] updateDeploymentColor failed:', err);
        return throwError(() => err);
      })
    );
  }

  updateDeploymentLivenessType(
    snowDeploymentId: string,
    livenessType: string
  ): Observable<unknown> {
    const params = new HttpParams().set('livenessType', livenessType);
    return this.http.put(
      `${this.config.api.baseUrl}/connectors/publish-snow-deployment/liveness-type/${snowDeploymentId}`,
      {},
      { params }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] updateDeploymentLivenessType failed:', err);
        return throwError(() => err);
      })
    );
  }

  deleteSnowDeployment(options: {
    repository: string;
    actorId: number;
    gitType: string;
  }): Observable<unknown> {
    const params = new HttpParams()
      .set('repository', options.repository)
      .set('actorId', String(options.actorId))
      .set('gitType', options.gitType);

    return this.http.delete(
      `${this.config.api.baseUrl}/connectors/publish-snow-deployment`,
      {
        params,
        responseType: 'text',
      }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] deleteSnowDeployment failed:', err);
        return throwError(() => err);
      })
    );
  }
}
