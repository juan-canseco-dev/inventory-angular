import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ProductsActions } from './products.actions';
import {
  ProductsState,
  initialMutationState,
  initialProductsState
} from './products.state';

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialProductsState,

    on(ProductsActions.loadPage, (state, { request }): ProductsState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(ProductsActions.loadPageSuccess, (state, { page }): ProductsState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(ProductsActions.loadPageFailure, (state, { error }): ProductsState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(ProductsActions.loadProductDetails, (state): ProductsState => ({
      ...state,
      details: null,
      detailsStatus: 'loading',
      detailsError: null
    })),

    on(ProductsActions.loadProductDetailsSuccess, (state, { details }): ProductsState => ({
      ...state,
      details,
      detailsStatus: 'success',
      detailsError: null
    })),

    on(ProductsActions.loadProductDetailsFailure, (state, { error }): ProductsState => ({
      ...state,
      details: null,
      detailsStatus: 'error',
      detailsError: error
    })),

    on(ProductsActions.resetProductDetailsState, (state): ProductsState => ({
      ...state,
      details: null,
      detailsStatus: 'idle',
      detailsError: null
    })),

    on(ProductsActions.createProduct, (state): ProductsState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(ProductsActions.createProductSuccess, (state): ProductsState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(ProductsActions.createProductFailure, (state, { error }): ProductsState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(ProductsActions.resetCreateProductState, (state): ProductsState => ({
      ...state,
      create: initialMutationState
    })),

    on(ProductsActions.updateProduct, (state): ProductsState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(ProductsActions.updateProductSuccess, (state): ProductsState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(ProductsActions.updateProductFailure, (state, { error }): ProductsState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(ProductsActions.resetUpdateProductState, (state): ProductsState => ({
      ...state,
      update: initialMutationState
    })),

    on(ProductsActions.deleteProduct, (state): ProductsState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(ProductsActions.deleteProductSuccess, (state): ProductsState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(ProductsActions.deleteProductFailure, (state, { error }): ProductsState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(ProductsActions.resetDeleteProductState, (state): ProductsState => ({
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
    selectProducts: createSelector(
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

    selectProductDetails: createSelector(
      selectDetails,
      (details) => details
    ),

    selectProductDetailsLoading: createSelector(
      selectDetailsStatus,
      (status) => status === 'loading'
    ),

    selectProductDetailsSuccess: createSelector(
      selectDetailsStatus,
      (status) => status === 'success'
    ),

    selectProductDetailsError: createSelector(
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
