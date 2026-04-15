import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ChangeUserRoleRequest,
  CreateUserRequest,
  GetUsersRequest,
  UpdateUserRequest
} from '../models';
import { UsersActions } from './users.actions';
import { usersFeature } from './users.feature';

@Injectable({
  providedIn: 'root'
})
export class UsersFacade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(usersFeature.selectPage);
  readonly users = this.store.selectSignal(usersFeature.selectUsers);
  readonly loading = this.store.selectSignal(usersFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(usersFeature.selectLoadError);
  readonly empty = this.store.selectSignal(usersFeature.selectIsEmpty);

  readonly userDetails = this.store.selectSignal(usersFeature.selectUserDetails);
  readonly userDetailsLoading = this.store.selectSignal(usersFeature.selectUserDetailsLoading);
  readonly userDetailsSuccess = this.store.selectSignal(usersFeature.selectUserDetailsSuccess);
  readonly userDetailsError = this.store.selectSignal(usersFeature.selectUserDetailsError);

  readonly createLoading = this.store.selectSignal(usersFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(usersFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(usersFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(usersFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(usersFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(usersFeature.selectUpdateError);

  readonly changeRoleLoading = this.store.selectSignal(usersFeature.selectChangeRoleLoading);
  readonly changeRoleSuccess = this.store.selectSignal(usersFeature.selectChangeRoleSuccess);
  readonly changeRoleError = this.store.selectSignal(usersFeature.selectChangeRoleError);

  readonly deleteLoading = this.store.selectSignal(usersFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(usersFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(usersFeature.selectDeleteError);

  loadPage(request: GetUsersRequest): void {
    this.store.dispatch(UsersActions.loadPage({ request }));
  }

  loadUserDetails(userId: number): void {
    this.store.dispatch(UsersActions.loadUserDetails({ userId }));
  }

  createUser(request: CreateUserRequest): void {
    this.store.dispatch(UsersActions.createUser({ request }));
  }

  updateUser(request: UpdateUserRequest): void {
    this.store.dispatch(UsersActions.updateUser({ request }));
  }

  changeUserRole(request: ChangeUserRoleRequest): void {
    this.store.dispatch(UsersActions.changeUserRole({ request }));
  }

  deleteUser(userId: number): void {
    this.store.dispatch(UsersActions.deleteUser({ userId }));
  }

  resetUserDetailsState(): void {
    this.store.dispatch(UsersActions.resetUserDetailsState());
  }

  resetCreateState(): void {
    this.store.dispatch(UsersActions.resetCreateUserState());
  }

  resetUpdateState(): void {
    this.store.dispatch(UsersActions.resetUpdateUserState());
  }

  resetChangeRoleState(): void {
    this.store.dispatch(UsersActions.resetChangeUserRoleState());
  }

  resetDeleteState(): void {
    this.store.dispatch(UsersActions.resetDeleteUserState());
  }
}
