import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import {
  initialMutationState,
  initialUsersState,
  UsersState
} from './users.state';

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialUsersState,

    on(UsersActions.loadPage, (state, { request }): UsersState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(UsersActions.loadPageSuccess, (state, { page }): UsersState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(UsersActions.loadPageFailure, (state, { error }): UsersState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(UsersActions.loadUserDetails, (state): UsersState => ({
      ...state,
      details: null,
      detailsStatus: 'loading',
      detailsError: null
    })),

    on(UsersActions.loadUserDetailsSuccess, (state, { details }): UsersState => ({
      ...state,
      details,
      detailsStatus: 'success',
      detailsError: null
    })),

    on(UsersActions.loadUserDetailsFailure, (state, { error }): UsersState => ({
      ...state,
      details: null,
      detailsStatus: 'error',
      detailsError: error
    })),

    on(UsersActions.resetUserDetailsState, (state): UsersState => ({
      ...state,
      details: null,
      detailsStatus: 'idle',
      detailsError: null
    })),

    on(UsersActions.createUser, (state): UsersState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(UsersActions.createUserSuccess, (state): UsersState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(UsersActions.createUserFailure, (state, { error }): UsersState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(UsersActions.resetCreateUserState, (state): UsersState => ({
      ...state,
      create: initialMutationState
    })),

    on(UsersActions.updateUser, (state): UsersState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(UsersActions.updateUserSuccess, (state): UsersState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(UsersActions.updateUserFailure, (state, { error }): UsersState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(UsersActions.resetUpdateUserState, (state): UsersState => ({
      ...state,
      update: initialMutationState
    })),

    on(UsersActions.changeUserRole, (state): UsersState => ({
      ...state,
      changeRole: {
        status: 'loading',
        error: null
      }
    })),

    on(UsersActions.changeUserRoleSuccess, (state): UsersState => ({
      ...state,
      changeRole: {
        status: 'success',
        error: null
      }
    })),

    on(UsersActions.changeUserRoleFailure, (state, { error }): UsersState => ({
      ...state,
      changeRole: {
        status: 'error',
        error
      }
    })),

    on(UsersActions.resetChangeUserRoleState, (state): UsersState => ({
      ...state,
      changeRole: initialMutationState
    })),

    on(UsersActions.deleteUser, (state): UsersState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(UsersActions.deleteUserSuccess, (state): UsersState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(UsersActions.deleteUserFailure, (state, { error }): UsersState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(UsersActions.resetDeleteUserState, (state): UsersState => ({
      ...state,
      delete: initialMutationState
    }))
  ),

  extraSelectors: ({
    selectPage,
    selectLoadStatus,
    selectLoadError,
    selectDetails,
    selectDetailsStatus,
    selectDetailsError,
    selectCreate,
    selectUpdate,
    selectChangeRole,
    selectDelete
  }) => ({
    selectUsers: createSelector(selectPage, (page) => page?.items ?? []),

    selectIsLoading: createSelector(
      selectLoadStatus,
      (status) => status === 'loading'
    ),

    selectIsEmpty: createSelector(
      selectLoadStatus,
      selectLoadError,
      selectPage,
      (status, error, page) =>
        status !== 'loading' &&
        !error &&
        (page?.items?.length ?? 0) === 0
    ),

    selectUserDetails: createSelector(selectDetails, (details) => details),
    selectUserDetailsLoading: createSelector(
      selectDetailsStatus,
      (status) => status === 'loading'
    ),
    selectUserDetailsSuccess: createSelector(
      selectDetailsStatus,
      (status) => status === 'success'
    ),
    selectUserDetailsError: createSelector(
      selectDetailsError,
      (error) => error
    ),

    selectCreateLoading: createSelector(
      selectCreate,
      (state) => state.status === 'loading'
    ),
    selectCreateSuccess: createSelector(
      selectCreate,
      (state) => state.status === 'success'
    ),
    selectCreateError: createSelector(
      selectCreate,
      (state) => state.error
    ),

    selectUpdateLoading: createSelector(
      selectUpdate,
      (state) => state.status === 'loading'
    ),
    selectUpdateSuccess: createSelector(
      selectUpdate,
      (state) => state.status === 'success'
    ),
    selectUpdateError: createSelector(
      selectUpdate,
      (state) => state.error
    ),

    selectChangeRoleLoading: createSelector(
      selectChangeRole,
      (state) => state.status === 'loading'
    ),
    selectChangeRoleSuccess: createSelector(
      selectChangeRole,
      (state) => state.status === 'success'
    ),
    selectChangeRoleError: createSelector(
      selectChangeRole,
      (state) => state.error
    ),

    selectDeleteLoading: createSelector(
      selectDelete,
      (state) => state.status === 'loading'
    ),
    selectDeleteSuccess: createSelector(
      selectDelete,
      (state) => state.status === 'success'
    ),
    selectDeleteError: createSelector(
      selectDelete,
      (state) => state.error
    )
  })
});
