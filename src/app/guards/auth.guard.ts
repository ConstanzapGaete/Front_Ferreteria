import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isBrowser } from '../utils/is-platform-browser';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  if (!isBrowser()) {
    return router.parseUrl('/no-autorizado');
  }

  const token = localStorage.getItem('token');

  if (token && !jwtHelper.isTokenExpired(token)) {
    const decoded = jwtHelper.decodeToken(token);
    const rol = decoded.rol;

    const expectedRoles = route.data?.['roles'] as string[];

    if (expectedRoles.includes(rol)) {
      return true;
    }
  }

  return router.parseUrl('/no-autorizado');
};
