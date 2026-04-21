import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AutocompleteActions } from './autocomplete.actions';
import {
  AutocompleteState,
  initialAutocompleteSliceState,
  initialAutocompleteState
} from './autocomplete.state';

export const autocompleteFeature = createFeature({
  name: 'autocomplete',
  reducer: createReducer(
    initialAutocompleteState,

    on(AutocompleteActions.loadCustomerOptions, (state, { query }): AutocompleteState => ({
      ...state,
      customers: {
        ...state.customers,
        query,
        status: 'loading',
        error: null
      }
    })),

    on(AutocompleteActions.loadCustomerOptionsSuccess, (state, { query, items }): AutocompleteState => ({
      ...state,
      customers: {
        items,
        query,
        status: 'success',
        error: null,
        loadedAt: new Date().toISOString()
      }
    })),

    on(AutocompleteActions.loadCustomerOptionsFailure, (state, { query, error }): AutocompleteState => ({
      ...state,
      customers: {
        ...state.customers,
        query,
        items: [],
        status: 'error',
        error
      }
    })),

    on(AutocompleteActions.clearCustomerOptions, (state): AutocompleteState => ({
      ...state,
      customers: initialAutocompleteSliceState
    })),

    on(AutocompleteActions.loadCategoryOptions, (state, { query }): AutocompleteState => ({
      ...state,
      categories: {
        ...state.categories,
        query,
        status: 'loading',
        error: null
      }
    })),

    on(AutocompleteActions.loadCategoryOptionsSuccess, (state, { query, items }): AutocompleteState => ({
      ...state,
      categories: {
        items,
        query,
        status: 'success',
        error: null,
        loadedAt: new Date().toISOString()
      }
    })),

    on(AutocompleteActions.loadCategoryOptionsFailure, (state, { query, error }): AutocompleteState => ({
      ...state,
      categories: {
        ...state.categories,
        query,
        items: [],
        status: 'error',
        error
      }
    })),

    on(AutocompleteActions.clearCategoryOptions, (state): AutocompleteState => ({
      ...state,
      categories: initialAutocompleteSliceState
    })),

    on(AutocompleteActions.loadRoleOptions, (state, { query }): AutocompleteState => ({
      ...state,
      roles: {
        ...state.roles,
        query,
        status: 'loading',
        error: null
      }
    })),

    on(AutocompleteActions.loadRoleOptionsSuccess, (state, { query, items }): AutocompleteState => ({
      ...state,
      roles: {
        items,
        query,
        status: 'success',
        error: null,
        loadedAt: new Date().toISOString()
      }
    })),

    on(AutocompleteActions.loadRoleOptionsFailure, (state, { query, error }): AutocompleteState => ({
      ...state,
      roles: {
        ...state.roles,
        query,
        items: [],
        status: 'error',
        error
      }
    })),

    on(AutocompleteActions.clearRoleOptions, (state): AutocompleteState => ({
      ...state,
      roles: initialAutocompleteSliceState
    })),

    on(AutocompleteActions.loadProductOptions, (state, { query }): AutocompleteState => ({
      ...state,
      products: {
        ...state.products,
        query,
        status: 'loading',
        error: null
      }
    })),

    on(AutocompleteActions.loadProductOptionsSuccess, (state, { query, items }): AutocompleteState => ({
      ...state,
      products: {
        items,
        query,
        status: 'success',
        error: null,
        loadedAt: new Date().toISOString()
      }
    })),

    on(AutocompleteActions.loadProductOptionsFailure, (state, { query, error }): AutocompleteState => ({
      ...state,
      products: {
        ...state.products,
        query,
        items: [],
        status: 'error',
        error
      }
    })),

    on(AutocompleteActions.clearProductOptions, (state): AutocompleteState => ({
      ...state,
      products: initialAutocompleteSliceState
    })),

    on(AutocompleteActions.loadSupplierOptions, (state, { query }): AutocompleteState => ({
      ...state,
      suppliers: {
        ...state.suppliers,
        query,
        status: 'loading',
        error: null
      }
    })),

    on(AutocompleteActions.loadSupplierOptionsSuccess, (state, { query, items }): AutocompleteState => ({
      ...state,
      suppliers: {
        items,
        query,
        status: 'success',
        error: null,
        loadedAt: new Date().toISOString()
      }
    })),

    on(AutocompleteActions.loadSupplierOptionsFailure, (state, { query, error }): AutocompleteState => ({
      ...state,
      suppliers: {
        ...state.suppliers,
        query,
        items: [],
        status: 'error',
        error
      }
    })),

    on(AutocompleteActions.clearSupplierOptions, (state): AutocompleteState => ({
      ...state,
      suppliers: initialAutocompleteSliceState
    })),

    on(AutocompleteActions.loadUnitOptions, (state, { query }): AutocompleteState => ({
      ...state,
      units: {
        ...state.units,
        query,
        status: 'loading',
        error: null
      }
    })),

    on(AutocompleteActions.loadUnitOptionsSuccess, (state, { query, items }): AutocompleteState => ({
      ...state,
      units: {
        items,
        query,
        status: 'success',
        error: null,
        loadedAt: new Date().toISOString()
      }
    })),

    on(AutocompleteActions.loadUnitOptionsFailure, (state, { query, error }): AutocompleteState => ({
      ...state,
      units: {
        ...state.units,
        query,
        items: [],
        status: 'error',
        error
      }
    })),

    on(AutocompleteActions.clearUnitOptions, (state): AutocompleteState => ({
      ...state,
      units: initialAutocompleteSliceState
    }))
  ),

  extraSelectors: ({ selectCustomers, selectCategories, selectRoles, selectProducts, selectSuppliers, selectUnits }) => ({
    selectCustomerOptions: createSelector(selectCustomers, (state) => state.items),
    selectCustomerOptionsQuery: createSelector(selectCustomers, (state) => state.query),
    selectCustomerOptionsLoading: createSelector(
      selectCustomers,
      (state) => state.status === 'loading'
    ),
    selectCustomerOptionsLoaded: createSelector(
      selectCustomers,
      (state) => state.status === 'success'
    ),
    selectCustomerOptionsError: createSelector(
      selectCustomers,
      (state) => state.error
    ),
    selectCustomerOptionsLoadedAt: createSelector(
      selectCustomers,
      (state) => state.loadedAt
    ),

    selectCategoryOptions: createSelector(selectCategories, (state) => state.items),
    selectCategoryOptionsQuery: createSelector(selectCategories, (state) => state.query),
    selectCategoryOptionsLoading: createSelector(
      selectCategories,
      (state) => state.status === 'loading'
    ),
    selectCategoryOptionsLoaded: createSelector(
      selectCategories,
      (state) => state.status === 'success'
    ),
    selectCategoryOptionsError: createSelector(
      selectCategories,
      (state) => state.error
    ),
    selectCategoryOptionsLoadedAt: createSelector(
      selectCategories,
      (state) => state.loadedAt
    ),

    selectRoleOptions: createSelector(selectRoles, (state) => state.items),
    selectRoleOptionsQuery: createSelector(selectRoles, (state) => state.query),
    selectRoleOptionsLoading: createSelector(
      selectRoles,
      (state) => state.status === 'loading'
    ),
    selectRoleOptionsLoaded: createSelector(
      selectRoles,
      (state) => state.status === 'success'
    ),
    selectRoleOptionsError: createSelector(
      selectRoles,
      (state) => state.error
    ),
    selectRoleOptionsLoadedAt: createSelector(
      selectRoles,
      (state) => state.loadedAt
    ),

    selectProductOptions: createSelector(selectProducts, (state) => state.items),
    selectProductOptionsQuery: createSelector(selectProducts, (state) => state.query),
    selectProductOptionsLoading: createSelector(
      selectProducts,
      (state) => state.status === 'loading'
    ),
    selectProductOptionsLoaded: createSelector(
      selectProducts,
      (state) => state.status === 'success'
    ),
    selectProductOptionsError: createSelector(
      selectProducts,
      (state) => state.error
    ),
    selectProductOptionsLoadedAt: createSelector(
      selectProducts,
      (state) => state.loadedAt
    ),

    selectSupplierOptions: createSelector(selectSuppliers, (state) => state.items),
    selectSupplierOptionsQuery: createSelector(selectSuppliers, (state) => state.query),
    selectSupplierOptionsLoading: createSelector(
      selectSuppliers,
      (state) => state.status === 'loading'
    ),
    selectSupplierOptionsLoaded: createSelector(
      selectSuppliers,
      (state) => state.status === 'success'
    ),
    selectSupplierOptionsError: createSelector(
      selectSuppliers,
      (state) => state.error
    ),
    selectSupplierOptionsLoadedAt: createSelector(
      selectSuppliers,
      (state) => state.loadedAt
    ),

    selectUnitOptions: createSelector(selectUnits, (state) => state.items),
    selectUnitOptionsQuery: createSelector(selectUnits, (state) => state.query),
    selectUnitOptionsLoading: createSelector(
      selectUnits,
      (state) => state.status === 'loading'
    ),
    selectUnitOptionsLoaded: createSelector(
      selectUnits,
      (state) => state.status === 'success'
    ),
    selectUnitOptionsError: createSelector(
      selectUnits,
      (state) => state.error
    ),
    selectUnitOptionsLoadedAt: createSelector(
      selectUnits,
      (state) => state.loadedAt
    )
  })
});
