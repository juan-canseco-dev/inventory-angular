import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn())  {
    router.navigateByUrl("auth");
    return false;
  }
  return true;
};
