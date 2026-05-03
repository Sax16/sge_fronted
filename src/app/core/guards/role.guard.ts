import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../pages/auth-pages/services/auth.service';
import { UserRole } from '../../pages/users/models/user.model';
import { filter, map, take } from 'rxjs';

/**
 * Role-Based Access Control Guard
 *
 * SRP: Only responsible for verifying if the authenticated user has
 * one of the required roles declared in route data.
 *
 * Handles the page-refresh race condition: if the user hasn't been
 * loaded yet (async HTTP call still in-flight), it awaits the first
 * non-null emission from currentUser$ before making a decision.
 *
 * Usage in routes:
 *   canActivate: [authGuard, roleGuard],
 *   data: { roles: [UserRoleType.SUPER_ADMIN] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: UserRole[] = route.data['roles'] ?? [];

  const checkRole = (role: UserRole): boolean | ReturnType<typeof router.createUrlTree> => {
    if (requiredRoles.length === 0 || requiredRoles.includes(role)) {
      return true;
    }
    // Authenticated but lacking the required role → redirect to dashboard
    return router.createUrlTree(['/']);
  };

  const currentUser = authService.getCurrentUserValue();

  // Fast path: user already loaded (normal navigation)
  if (currentUser) {
    return checkRole(currentUser.role);
  }

  // Slow path: page refresh — wait for the in-flight HTTP call to resolve
  return authService.currentUser$.pipe(
    filter(user => user !== null),
    take(1),
    map(user => checkRole(user!.role))
  );
};
