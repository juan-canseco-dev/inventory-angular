import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Error, PagedList } from '../../../shared/types';
import {
  CreateRoleRequest,
  GetRolesRequest,
  Role,
  RoleDetails,
  UpdateRoleRequest
} from '../models';
import { PermissionResourceGroup } from '../../../core/permissions/models';

export const RolesActions = createActionGroup({
  source: 'Roles',
  events: {
    'Load Page': props<{ request: GetRolesRequest }>(),
    'Load Page Success': props<{ page: PagedList<Role> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Load Role Details': props<{ roleId: number }>(),
    'Load Role Details Success': props<{ details: RoleDetails }>(),
    'Load Role Details Failure': props<{ error: Error }>(),
    'Reset Role Details State': emptyProps(),

    'Load Permission Groups': emptyProps(),
    'Load Permission Groups Success': props<{ permissionGroups: PermissionResourceGroup[] }>(),
    'Load Permission Groups Failure': props<{ error: Error }>(),
    'Reset Permission Groups State': emptyProps(),

    'Create Role': props<{ request: CreateRoleRequest }>(),
    'Create Role Success': props<{ roleId: number }>(),
    'Create Role Failure': props<{ error: Error }>(),
    'Reset Create Role State': emptyProps(),

    'Update Role': props<{ request: UpdateRoleRequest }>(),
    'Update Role Success': emptyProps(),
    'Update Role Failure': props<{ error: Error }>(),
    'Reset Update Role State': emptyProps(),

    'Delete Role': props<{ roleId: number }>(),
    'Delete Role Success': emptyProps(),
    'Delete Role Failure': props<{ error: Error }>(),
    'Reset Delete Role State': emptyProps()
  }
});
