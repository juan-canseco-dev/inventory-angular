import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SuppliersActions } from './suppliers.actions';
import {
  SuppliersState,
  initialSuppliersState,
  initialMutationState
} from './suppliers.state';

export const suppliersFeature = createFeature({
  name: 'suppliers',
  reducer: createReducer(
    initialSuppliersState,

    on(SuppliersActions.loadPage, (state, { request }): SuppliersState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(SuppliersActions.loadPageSuccess, (state, { page }): SuppliersState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(SuppliersActions.loadPageFailure, (state, { error }): SuppliersState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(SuppliersActions.loadSupplierDetails, (state): SuppliersState => ({
      ...state,
      details: null,
      detailsStatus: 'loading',
      detailsError: null
    })),

    on(SuppliersActions.loadSupplierDetailsSuccess, (state, { details }): SuppliersState => ({
      ...state,
      details,
      detailsStatus: 'success',
      detailsError: null
    })),

    on(SuppliersActions.loadSupplierDetailsFailure, (state, { error }): SuppliersState => ({
      ...state,
      details: null,
      detailsStatus: 'error',
      detailsError: error
    })),

    on(SuppliersActions.resetSupplierDetailsState, (state): SuppliersState => ({
      ...state,
      details: null,
      detailsStatus: 'idle',
      detailsError: null
    })),

    on(SuppliersActions.createSupplier, (state): SuppliersState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(SuppliersActions.createSupplierSuccess, (state): SuppliersState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(SuppliersActions.createSupplierFailure, (state, { error }): SuppliersState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(SuppliersActions.resetCreateSupplierState, (state): SuppliersState => ({
      ...state,
      create: initialMutationState
    })),

    on(SuppliersActions.updateSupplier, (state): SuppliersState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(SuppliersActions.updateSupplierSuccess, (state): SuppliersState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(SuppliersActions.updateSupplierFailure, (state, { error }): SuppliersState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(SuppliersActions.resetUpdateSupplierState, (state): SuppliersState => ({
      ...state,
      update: initialMutationState
    })),

    on(SuppliersActions.deleteSupplier, (state): SuppliersState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(SuppliersActions.deleteSupplierSuccess, (state): SuppliersState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(SuppliersActions.deleteSupplierFailure, (state, { error }): SuppliersState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(SuppliersActions.resetDeleteSupplierState, (state): SuppliersState => ({
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
    selectDelete
  }) => ({
    selectSuppliers: createSelector(
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

    selectSupplierDetails: createSelector(
      selectDetails,
      (details) => details
    ),

    selectSupplierDetailsLoading: createSelector(
      selectDetailsStatus,
      (status) => status === 'loading'
    ),

    selectSupplierDetailsSuccess: createSelector(
      selectDetailsStatus,
      (status) => status === 'success'
    ),

    selectSupplierDetailsError: createSelector(
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
