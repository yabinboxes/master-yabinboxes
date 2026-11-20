import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, throwError } from 'rxjs';
import { DashboardAuth } from '../services/auth/dashboard-auth';
import { RuntimeConfig } from '../services/runtime-config';

const unauthorized = (message: string) =>
  throwError(
    () =>
      new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: { message },
      })
  );

/**
 * Attaches the signed-in user's OAuth access token as `Authorization: Bearer <token>`
 * on requests to the snow connectors API (`snowConfig.api.baseUrl`).
 */
export const gitlabAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(RuntimeConfig);
  if (!req.url.startsWith(config.api.baseUrl)) {
    return next(req);
  }
  if (req.url.startsWith(`${config.api.baseUrl}/connectors/self-hosted`)) {
    return next(req);
  }

  const auth = inject(DashboardAuth);
  if (!auth.isAuthenticated()) {
    return unauthorized('User is not authenticated');
  }

  return auth.getAccessToken().pipe(
    switchMap((token) => {
      if (!token) {
        return unauthorized('Access token is unavailable');
      }
      return next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    })
  );
};
