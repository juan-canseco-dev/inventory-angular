import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CategoriesActions } from './categories.actions';
import {
  CategoriesState,
  initialCategoriesState,
  initialMutationState
} from './categories.state';

export const categoriesFeature = createFeature({
  name: 'categories',
  reducer: createReducer(
    initialCategoriesState,

    on(CategoriesActions.loadPage, (state, { request }): CategoriesState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(CategoriesActions.loadPageSuccess, (state, { page }): CategoriesState => ({
      ...state,
      page,
      loadStatus: 'success'
    })),

    on(CategoriesActions.loadPageFailure, (state, { error }): CategoriesState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    })),

    on(CategoriesActions.createCategory, (state): CategoriesState => ({
      ...state,
      create: {
        status: 'loading',
        error: null
      }
    })),

    on(CategoriesActions.createCategorySuccess, (state): CategoriesState => ({
      ...state,
      create: {
        status: 'success',
        error: null
      }
    })),

    on(CategoriesActions.createCategoryFailure, (state, { error }): CategoriesState => ({
      ...state,
      create: {
        status: 'error',
        error
      }
    })),

    on(CategoriesActions.resetCreateCategoryState, (state): CategoriesState => ({
      ...state,
      create: initialMutationState
    })),

    on(CategoriesActions.updateCategory, (state): CategoriesState => ({
      ...state,
      update: {
        status: 'loading',
        error: null
      }
    })),

    on(CategoriesActions.updateCategorySuccess, (state): CategoriesState => ({
      ...state,
      update: {
        status: 'success',
        error: null
      }
    })),

    on(CategoriesActions.updateCategoryFailure, (state, { error }): CategoriesState => ({
      ...state,
      update: {
        status: 'error',
        error
      }
    })),

    on(CategoriesActions.resetUpdateCategoryState, (state): CategoriesState => ({
      ...state,
      update: initialMutationState
    })),

    on(CategoriesActions.deleteCategory, (state): CategoriesState => ({
      ...state,
      delete: {
        status: 'loading',
        error: null
      }
    })),

    on(CategoriesActions.deleteCategorySuccess, (state): CategoriesState => ({
      ...state,
      delete: {
        status: 'success',
        error: null
      }
    })),

    on(CategoriesActions.deleteCategoryFailure, (state, { error }): CategoriesState => ({
      ...state,
      delete: {
        status: 'error',
        error
      }
    })),

    on(CategoriesActions.resetDeleteCategoryState, (state): CategoriesState => ({
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
    selectCategories: createSelector(
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
