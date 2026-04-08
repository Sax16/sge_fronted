import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Authentication Interceptor
 *
 * Responsibilities (SRP — two distinct concerns kept minimal):
 *   1. Attaches the Bearer token to every outgoing request.
 *   2. Catches 401 Unauthorized responses and forces logout:
 *      – Clears tokens from storage directly (avoids circular DI with AuthService).
 *      – Skips redirect for the login endpoint itself (wrong credentials are
 *        handled by the SignInComponent, not the interceptor).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const TOKEN_KEY = 'access_token';
  const router = inject(Router); // must be called in the injection context (top level of the fn)
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      // Guard: only handle real HTTP errors
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const isLoginEndpoint = req.url.includes('/auth/login');

      if (error.status === 401 && !isLoginEndpoint) {
        // Token expired or invalid during an active session → force logout
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        router.navigate(['/signin']);
      }

      return throwError(() => error);
    })
  );
};
