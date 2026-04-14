import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UnitsActions } from './units.actions';
import {
  UnitsState,
  initialUnitsState,
  initialMutationState
} from './units.state';

export const unitsFeature = createFeature({
  name: 'units',
  reducer: createReducer(
    initialUnitsState,

    on(UnitsActions.loadPage, (state, { request }): UnitsState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(UnitsActions.loadPageSuccess, (state, { page }): UnitsState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(UnitsActions.loadPageFailure, (state, { error }): UnitsState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(UnitsActions.createUnit, (state): UnitsState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(UnitsActions.createUnitSuccess, (state): UnitsState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(UnitsActions.createUnitFailure, (state, { error }): UnitsState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(UnitsActions.resetCreateUnitState, (state): UnitsState => ({
      ...state,
      create: initialMutationState
    })),

    on(UnitsActions.updateUnit, (state): UnitsState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(UnitsActions.updateUnitSuccess, (state): UnitsState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(UnitsActions.updateUnitFailure, (state, { error }): UnitsState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(UnitsActions.resetUpdateUnitState, (state): UnitsState => ({
      ...state,
      update: initialMutationState
    })),

    on(UnitsActions.deleteUnit, (state): UnitsState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(UnitsActions.deleteUnitSuccess, (state): UnitsState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(UnitsActions.deleteUnitFailure, (state, { error }): UnitsState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(UnitsActions.resetDeleteUnitState, (state): UnitsState => ({
      ...state,
      delete: initialMutationState
    }))
  ),

  extraSelectors: ({
    selectPage,
    selectLoadStatus,
    selectLoadError,
    selectCreate,
    selectUpdate,
    selectDelete
  }) => ({
    selectUnits: createSelector(
      selectPage,
      (page) => page?.items ?? []
    ),

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
