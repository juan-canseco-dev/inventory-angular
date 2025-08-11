import { CanActivateFn } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const notLoggedInGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigateByUrl("/");
    return false;
  }

  // Cleans JWT Token
  authService.removeJwt();

  return true;
};
