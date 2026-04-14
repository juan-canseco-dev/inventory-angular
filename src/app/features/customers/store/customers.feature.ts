import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CustomersActions } from './customers.actions';
import {
  CustomersState,
  initialCustomersState,
  initialMutationState
} from './customers.state';

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer(
    initialCustomersState,

    on(CustomersActions.loadPage, (state, { request }): CustomersState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(CustomersActions.loadPageSuccess, (state, { page }): CustomersState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(CustomersActions.loadPageFailure, (state, { error }): CustomersState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(CustomersActions.loadCustomerDetails, (state): CustomersState => ({
      ...state,
      details: null,
      detailsStatus: 'loading',
      detailsError: null
    })),

    on(CustomersActions.loadCustomerDetailsSuccess, (state, { details }): CustomersState => ({
      ...state,
      details,
      detailsStatus: 'success',
      detailsError: null
    })),

    on(CustomersActions.loadCustomerDetailsFailure, (state, { error }): CustomersState => ({
      ...state,
      details: null,
      detailsStatus: 'error',
      detailsError: error
    })),

    on(CustomersActions.resetCustomerDetailsState, (state): CustomersState => ({
      ...state,
      details: null,
      detailsStatus: 'idle',
      detailsError: null
    })),

    on(CustomersActions.createCustomer, (state): CustomersState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(CustomersActions.createCustomerSuccess, (state): CustomersState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(CustomersActions.createCustomerFailure, (state, { error }): CustomersState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(CustomersActions.resetCreateCustomerState, (state): CustomersState => ({
      ...state,
      create: initialMutationState
    })),

    on(CustomersActions.updateCustomer, (state): CustomersState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(CustomersActions.updateCustomerSuccess, (state): CustomersState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(CustomersActions.updateCustomerFailure, (state, { error }): CustomersState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(CustomersActions.resetUpdateCustomerState, (state): CustomersState => ({
      ...state,
      update: initialMutationState
    })),

    on(CustomersActions.deleteCustomer, (state): CustomersState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(CustomersActions.deleteCustomerSuccess, (state): CustomersState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(CustomersActions.deleteCustomerFailure, (state, { error }): CustomersState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(CustomersActions.resetDeleteCustomerState, (state): CustomersState => ({
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
    selectCustomers: createSelector(
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

    selectCustomerDetails: createSelector(
      selectDetails,
      (details) => details
    ),

    selectCustomerDetailsLoading: createSelector(
      selectDetailsStatus,
      (status) => status === 'loading'
    ),

    selectCustomerDetailsSuccess: createSelector(
      selectDetailsStatus,
      (status) => status === 'success'
    ),

    selectCustomerDetailsError: createSelector(
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
