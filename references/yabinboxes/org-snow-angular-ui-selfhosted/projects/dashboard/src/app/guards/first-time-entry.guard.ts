import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SelfHostedApi } from '../services/actions-api/self-hosted.api';
import { DashboardAuth } from '../services/auth/dashboard-auth';
import { RuntimeConfig } from '../services/runtime-config';

export const firstTimeEntryGuard: CanActivateFn = (_route, state) => {
  const auth = inject(DashboardAuth);
  const api = inject(SelfHostedApi);
  const router = inject(Router);
  const runtimeConfig = inject(RuntimeConfig);
  const path = state.url.split('?')[0];
  const onLogin = path === '/login';

  if (auth.isAuthenticated()) {
    return onLogin ? true : router.createUrlTree(['/dashboard']);
  }

  return api.getRecord().pipe(
    map((row): boolean | UrlTree => {
      try {
        runtimeConfig.applyPersistedSetup(row);
      } catch {
        // Keep the current auth settings when the saved URL is no longer valid.
      }
      if (row.firstTimeFlag === 1) {
        return router.createUrlTree(['/settings-first-time-configs']);
      }
      return onLogin ? true : router.createUrlTree(['/login']);
    }),
    catchError(() => of(router.createUrlTree(['/backend-unavailable']))),
  );
};
