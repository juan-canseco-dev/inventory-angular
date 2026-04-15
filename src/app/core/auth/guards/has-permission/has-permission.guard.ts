import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { PermissionsFacade } from '../../store';

export const hasPermissionGuard: CanActivateChildFn | CanActivateFn = (childRoute, state) => {
  const permissionsFacade = inject(PermissionsFacade);
  const router = inject(Router);
  let permission : string = childRoute.data['permission'];
  if (!permissionsFacade.hasPermission(permission)) {
    router.navigateByUrl("/");
    return false;
  }
  return true;
};
