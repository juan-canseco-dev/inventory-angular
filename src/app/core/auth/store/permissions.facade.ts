import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthPermissions } from './auth.selector';

@Injectable({
  providedIn: 'root'
})
export class PermissionsFacade {
  private readonly store = inject(Store);

  readonly permissions = this.store.selectSignal(selectAuthPermissions);

  private readonly permissionSet = computed(() => new Set(this.permissions()));

  hasPermission(permission: string): boolean {
    return this.permissionSet().has(permission);
  }

  hasAnyPermission(permissions: readonly string[]): boolean {
    const userPermissions = this.permissionSet();
    return permissions.some((permission) => userPermissions.has(permission));
  }
}
