import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

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
 * Attaches Firebase ID token as `Authorization: Bearer <token>`
 * on requests to the snow connectors API (`environment.api.baseUrl`).
 * Protected API requests fail closed when Firebase auth is unavailable.
 */
export const firebaseAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.api.baseUrl)) {
    return next(req);
  }

  const auth = inject(Auth);
  const user = auth.currentUser;

  if (!user) {
    return unauthorized('Firebase user is not authenticated');
  }

  return from(user.getIdToken()).pipe(
    switchMap((idToken) => {
      if (!idToken) {
        return unauthorized('Firebase ID token is unavailable');
      }
      return next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${idToken}`,
          },
        })
      );
    })
  );
};
