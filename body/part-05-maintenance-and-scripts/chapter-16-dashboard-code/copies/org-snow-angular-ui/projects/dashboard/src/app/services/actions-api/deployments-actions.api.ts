import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { APIPersistentSnowDeployment, APISnowDeploymentResponse, PublishSnowDeploymentPayload } from '../../interfaces/api/api-deployment.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeploymentsActionsApi {
  // API boundary for deployment CRUD-like operations.
  private readonly http = inject(HttpClient);

  fetchPersistentSnowDeployments(): Observable<APIPersistentSnowDeployment[]> {
    return this.http.get<APIPersistentSnowDeployment[]>(
      `${environment.api.baseUrl}${environment.api.endpoints.snowDeploymentsPersistent}`
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] fetchPersistentSnowDeployments failed:', err);
        return throwError(() => err);
      })
    );
  }

  fetchSnowDeployments(
    actorId: number,
    type: string,
    gitType: string = 'github'
  ): Observable<APISnowDeploymentResponse[]> {
    const params = new HttpParams()
      .set('actorId', String(actorId))
      .set('gitType', gitType)
      .set('type', type);

    return this.http.get<APISnowDeploymentResponse[]>(
      `${environment.api.baseUrl}${environment.api.endpoints.snowDeployments}`,
      { params }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] fetchSnowDeployments failed:', err);
        return throwError(() => err);
      })
    );
  }

  /** @deprecated Import screen. Not routed. */
  publishSnowDeployment(payload: PublishSnowDeploymentPayload): Observable<HttpResponse<string>> {
    return this.http.post(
      `${environment.api.baseUrl}/publish-snow-deployment`,
      payload,
      { observe: 'response', responseType: 'text' }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] publishSnowDeployment failed:', err);
        return throwError(() => err);
      })
    );
  }

  updateDeploymentColor(sourceId: string, color: string): Observable<unknown> {
    const params = new HttpParams().set('color', color || 'nocolor');
    return this.http.put(
      `${environment.api.baseUrl}/publish-snow-deployment/color/${sourceId}`,
      {},
      { params }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] updateDeploymentColor failed:', err);
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
      `${environment.api.baseUrl}/publish-snow-deployment`,
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

  updateDeploymentLivenessType(
    snowDeploymentId: string,
    livenessType: string
  ): Observable<unknown> {
    const params = new HttpParams().set('livenessType', livenessType);
    return this.http.put(
      `${environment.api.baseUrl}/publish-snow-deployment/liveness-type/${snowDeploymentId}`,
      {},
      { params }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('[DeploymentsActionsApi] updateDeploymentLivenessType failed:', err);
        return throwError(() => err);
      })
    );
  }
}
