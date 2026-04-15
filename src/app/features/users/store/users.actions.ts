import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Error, PagedList } from '../../../shared/types';
import {
  ChangeUserRoleRequest,
  CreateUserRequest,
  GetUsersRequest,
  UpdateUserRequest,
  User,
  UserWithDetails
} from '../models';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Page': props<{ request: GetUsersRequest }>(),
    'Load Page Success': props<{ page: PagedList<User> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Load User Details': props<{ userId: number }>(),
    'Load User Details Success': props<{ details: UserWithDetails }>(),
    'Load User Details Failure': props<{ error: Error }>(),
    'Reset User Details State': emptyProps(),

    'Create User': props<{ request: CreateUserRequest }>(),
    'Create User Success': props<{ userId: number }>(),
    'Create User Failure': props<{ error: Error }>(),
    'Reset Create User State': emptyProps(),

    'Update User': props<{ request: UpdateUserRequest }>(),
    'Update User Success': emptyProps(),
    'Update User Failure': props<{ error: Error }>(),
    'Reset Update User State': emptyProps(),

    'Change User Role': props<{ request: ChangeUserRoleRequest }>(),
    'Change User Role Success': emptyProps(),
    'Change User Role Failure': props<{ error: Error }>(),
    'Reset Change User Role State': emptyProps(),

    'Delete User': props<{ userId: number }>(),
    'Delete User Success': emptyProps(),
    'Delete User Failure': props<{ error: Error }>(),
    'Reset Delete User State': emptyProps()
  }
});
