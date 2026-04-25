import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { PurchasesActions } from './purchases.actions';
import {
  PurchasesState,
  initialMutationState,
  initialPurchasesState
} from './purchases.state';

export const purchasesFeature = createFeature({
  name: 'purchases',
  reducer: createReducer(
    initialPurchasesState,

    on(PurchasesActions.loadPage, (state, { request }): PurchasesState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(PurchasesActions.loadPageSuccess, (state, { page }): PurchasesState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(PurchasesActions.loadPageFailure, (state, { error }): PurchasesState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(PurchasesActions.loadPurchaseDetails, (state): PurchasesState => ({
      ...state,
      details: null,
      detailsStatus: 'loading',
      detailsError: null
    })),

    on(PurchasesActions.loadPurchaseDetailsSuccess, (state, { details }): PurchasesState => ({
      ...state,
      details,
      detailsStatus: 'success',
      detailsError: null
    })),

    on(PurchasesActions.loadPurchaseDetailsFailure, (state, { error }): PurchasesState => ({
      ...state,
      details: null,
      detailsStatus: 'error',
      detailsError: error
    })),

    on(PurchasesActions.resetPurchaseDetailsState, (state): PurchasesState => ({
      ...state,
      details: null,
      detailsStatus: 'idle',
      detailsError: null
    })),

    on(PurchasesActions.createPurchase, (state): PurchasesState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(PurchasesActions.createPurchaseSuccess, (state): PurchasesState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(PurchasesActions.createPurchaseFailure, (state, { error }): PurchasesState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(PurchasesActions.resetCreatePurchaseState, (state): PurchasesState => ({
      ...state,
      create: initialMutationState
    })),

    on(PurchasesActions.updatePurchase, (state): PurchasesState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(PurchasesActions.updatePurchaseSuccess, (state): PurchasesState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(PurchasesActions.updatePurchaseFailure, (state, { error }): PurchasesState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(PurchasesActions.resetUpdatePurchaseState, (state): PurchasesState => ({
      ...state,
      update: initialMutationState
    })),

    on(PurchasesActions.deletePurchase, (state): PurchasesState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(PurchasesActions.deletePurchaseSuccess, (state): PurchasesState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(PurchasesActions.deletePurchaseFailure, (state, { error }): PurchasesState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(PurchasesActions.resetDeletePurchaseState, (state): PurchasesState => ({
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
    selectPurchases: createSelector(
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

    selectPurchaseDetails: createSelector(
      selectDetails,
      (details) => details
    ),

    selectPurchaseDetailsLoading: createSelector(
      selectDetailsStatus,
      (status) => status === 'loading'
    ),

    selectPurchaseDetailsSuccess: createSelector(
      selectDetailsStatus,
      (status) => status === 'success'
    ),

    selectPurchaseDetailsError: createSelector(
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
