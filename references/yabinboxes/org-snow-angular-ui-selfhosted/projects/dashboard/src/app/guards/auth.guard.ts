import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { DashboardAuth } from '../services/auth/dashboard-auth';
import { map, take, filter } from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(DashboardAuth);
  const router = inject(Router);

  // Wait for auth loading to complete, then check authentication
  const checkAuth = () => {
    if (authService.isAuthenticated()) {
      return true;
    } else {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  };

  // If still loading, wait for it to complete
  if (authService.isLoading()) {
    return timer(0, 50).pipe(
      filter(() => !authService.isLoading()),
      take(1),
      map(() => checkAuth())
    );
  }

  // Auth state is already determined
  return checkAuth();
};
