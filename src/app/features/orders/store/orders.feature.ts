import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { OrdersActions } from './orders.actions';
import {
  OrdersState,
  initialMutationState,
  initialOrdersState
} from './orders.state';

export const ordersFeature = createFeature({
  name: 'orders',
  reducer: createReducer(
    initialOrdersState,

    on(OrdersActions.loadPage, (state, { request }): OrdersState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(OrdersActions.loadPageSuccess, (state, { page }): OrdersState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(OrdersActions.loadPageFailure, (state, { error }): OrdersState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(OrdersActions.loadOrderDetails, (state): OrdersState => ({
      ...state,
      details: null,
      detailsStatus: 'loading',
      detailsError: null
    })),

    on(OrdersActions.loadOrderDetailsSuccess, (state, { details }): OrdersState => ({
      ...state,
      details,
      detailsStatus: 'success',
      detailsError: null
    })),

    on(OrdersActions.loadOrderDetailsFailure, (state, { error }): OrdersState => ({
      ...state,
      details: null,
      detailsStatus: 'error',
      detailsError: error
    })),

    on(OrdersActions.resetOrderDetailsState, (state): OrdersState => ({
      ...state,
      details: null,
      detailsStatus: 'idle',
      detailsError: null
    })),

    on(OrdersActions.createOrder, (state): OrdersState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(OrdersActions.createOrderSuccess, (state): OrdersState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(OrdersActions.createOrderFailure, (state, { error }): OrdersState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(OrdersActions.resetCreateOrderState, (state): OrdersState => ({
      ...state,
      create: initialMutationState
    })),

    on(OrdersActions.updateOrder, (state): OrdersState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(OrdersActions.updateOrderSuccess, (state): OrdersState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(OrdersActions.updateOrderFailure, (state, { error }): OrdersState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(OrdersActions.resetUpdateOrderState, (state): OrdersState => ({
      ...state,
      update: initialMutationState
    })),

    on(OrdersActions.deleteOrder, (state): OrdersState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(OrdersActions.deleteOrderSuccess, (state): OrdersState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(OrdersActions.deleteOrderFailure, (state, { error }): OrdersState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(OrdersActions.resetDeleteOrderState, (state): OrdersState => ({
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
    selectOrders: createSelector(
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

    selectOrderDetails: createSelector(
      selectDetails,
      (details) => details
    ),

    selectOrderDetailsLoading: createSelector(
      selectDetailsStatus,
      (status) => status === 'loading'
    ),

    selectOrderDetailsSuccess: createSelector(
      selectDetailsStatus,
      (status) => status === 'success'
    ),

    selectOrderDetailsError: createSelector(
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
