import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  initialMutationState,
  initialRolesState,
  RolesState
} from './roles.state';
import { RolesActions } from './roles.actions';

export const rolesFeature = createFeature({
  name: 'roles',
  reducer: createReducer(
    initialRolesState,

    on(RolesActions.loadPage, (state, { request }): RolesState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(RolesActions.loadPageSuccess, (state, { page }): RolesState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(RolesActions.loadPageFailure, (state, { error }): RolesState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(RolesActions.loadRoleDetails, (state): RolesState => ({
      ...state,
      details: null,
      detailsStatus: 'loading',
      detailsError: null
    })),

    on(RolesActions.loadRoleDetailsSuccess, (state, { details }): RolesState => ({
      ...state,
      details,
      detailsStatus: 'success',
      detailsError: null
    })),

    on(RolesActions.loadRoleDetailsFailure, (state, { error }): RolesState => ({
      ...state,
      details: null,
      detailsStatus: 'error',
      detailsError: error
    })),

    on(RolesActions.resetRoleDetailsState, (state): RolesState => ({
      ...state,
      details: null,
      detailsStatus: 'idle',
      detailsError: null
    })),

    on(RolesActions.loadPermissionGroups, (state): RolesState => ({
      ...state,
      permissionGroups: [],
      permissionGroupsStatus: 'loading',
      permissionGroupsError: null
    })),

    on(RolesActions.loadPermissionGroupsSuccess, (state, { permissionGroups }): RolesState => ({
      ...state,
      permissionGroups,
      permissionGroupsStatus: 'success',
      permissionGroupsError: null
    })),

    on(RolesActions.loadPermissionGroupsFailure, (state, { error }): RolesState => ({
      ...state,
      permissionGroups: [],
      permissionGroupsStatus: 'error',
      permissionGroupsError: error
    })),

    on(RolesActions.resetPermissionGroupsState, (state): RolesState => ({
      ...state,
      permissionGroups: [],
      permissionGroupsStatus: 'idle',
      permissionGroupsError: null
    })),

    on(RolesActions.createRole, (state): RolesState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(RolesActions.createRoleSuccess, (state): RolesState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(RolesActions.createRoleFailure, (state, { error }): RolesState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(RolesActions.resetCreateRoleState, (state): RolesState => ({
      ...state,
      create: initialMutationState
    })),

    on(RolesActions.updateRole, (state): RolesState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(RolesActions.updateRoleSuccess, (state): RolesState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(RolesActions.updateRoleFailure, (state, { error }): RolesState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(RolesActions.resetUpdateRoleState, (state): RolesState => ({
      ...state,
      update: initialMutationState
    })),

    on(RolesActions.deleteRole, (state): RolesState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(RolesActions.deleteRoleSuccess, (state): RolesState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(RolesActions.deleteRoleFailure, (state, { error }): RolesState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(RolesActions.resetDeleteRoleState, (state): RolesState => ({
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
    selectPermissionGroups,
    selectPermissionGroupsStatus,
    selectPermissionGroupsError,
    selectCreate,
    selectUpdate,
    selectDelete
  }) => ({
    selectRoles: createSelector(selectPage, (page) => page?.items ?? []),

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

    selectRoleDetails: createSelector(selectDetails, (details) => details),
    selectRoleDetailsLoading: createSelector(
      selectDetailsStatus,
      (status) => status === 'loading'
    ),
    selectRoleDetailsSuccess: createSelector(
      selectDetailsStatus,
      (status) => status === 'success'
    ),
    selectRoleDetailsError: createSelector(
      selectDetailsError,
      (error) => error
    ),

    selectPermissionResourceGroups: createSelector(
      selectPermissionGroups,
      (permissionGroups) => permissionGroups
    ),
    selectPermissionGroupsLoading: createSelector(
      selectPermissionGroupsStatus,
      (status) => status === 'loading'
    ),
    selectPermissionGroupsSuccess: createSelector(
      selectPermissionGroupsStatus,
      (status) => status === 'success'
    ),
    selectPermissionGroupsError: createSelector(
      selectPermissionGroupsError,
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
