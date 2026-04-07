import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/auth-pages/services/auth.service';

/**
 * Authentication Guard
 *
 * SRP: Only responsible for verifying if the user has an active session.
 * If not authenticated, redirects to the sign-in page.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/signin']);
};
