import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  CreateRoleRequest,
  GetRolesRequest,
  UpdateRoleRequest
} from '../models';
import { RolesActions } from './roles.actions';
import { rolesFeature } from './roles.feature';

@Injectable({
  providedIn: 'root'
})
export class RolesFecade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(rolesFeature.selectPage);
  readonly roles = this.store.selectSignal(rolesFeature.selectRoles);
  readonly loading = this.store.selectSignal(rolesFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(rolesFeature.selectLoadError);
  readonly empty = this.store.selectSignal(rolesFeature.selectIsEmpty);

  readonly roleDetails = this.store.selectSignal(rolesFeature.selectRoleDetails);
  readonly roleDetailsLoading = this.store.selectSignal(rolesFeature.selectRoleDetailsLoading);
  readonly roleDetailsSuccess = this.store.selectSignal(rolesFeature.selectRoleDetailsSuccess);
  readonly roleDetailsError = this.store.selectSignal(rolesFeature.selectRoleDetailsError);

  readonly permissionGroups = this.store.selectSignal(rolesFeature.selectPermissionResourceGroups);
  readonly permissionGroupsLoading = this.store.selectSignal(rolesFeature.selectPermissionGroupsLoading);
  readonly permissionGroupsSuccess = this.store.selectSignal(rolesFeature.selectPermissionGroupsSuccess);
  readonly permissionGroupsError = this.store.selectSignal(rolesFeature.selectPermissionGroupsError);

  readonly createLoading = this.store.selectSignal(rolesFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(rolesFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(rolesFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(rolesFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(rolesFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(rolesFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(rolesFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(rolesFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(rolesFeature.selectDeleteError);

  loadPage(request: GetRolesRequest): void {
    this.store.dispatch(RolesActions.loadPage({ request }));
  }

  loadRoleDetails(roleId: number): void {
    this.store.dispatch(RolesActions.loadRoleDetails({ roleId }));
  }

  loadPermissionGroups(): void {
    this.store.dispatch(RolesActions.loadPermissionGroups());
  }

  createRole(request: CreateRoleRequest): void {
    this.store.dispatch(RolesActions.createRole({ request }));
  }

  updateRole(request: UpdateRoleRequest): void {
    this.store.dispatch(RolesActions.updateRole({ request }));
  }

  deleteRole(roleId: number): void {
    this.store.dispatch(RolesActions.deleteRole({ roleId }));
  }

  resetRoleDetailsState(): void {
    this.store.dispatch(RolesActions.resetRoleDetailsState());
  }

  resetPermissionGroupsState(): void {
    this.store.dispatch(RolesActions.resetPermissionGroupsState());
  }

  resetCreateState(): void {
    this.store.dispatch(RolesActions.resetCreateRoleState());
  }

  resetUpdateState(): void {
    this.store.dispatch(RolesActions.resetUpdateRoleState());
  }

  resetDeleteState(): void {
    this.store.dispatch(RolesActions.resetDeleteRoleState());
  }
}
