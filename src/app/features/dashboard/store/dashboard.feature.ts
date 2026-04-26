import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardState, initialDashboardState } from './dashboard.state';

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialDashboardState,

    on(DashboardActions.loadDashboard, (state, { request }): DashboardState => ({
      ...state,
      request,
      loadStatus: 'loading',
      loadError: null
    })),

    on(DashboardActions.loadDashboardSuccess, (state, { data }): DashboardState => ({
      ...state,
      data,
      loadStatus: 'success',
      loadError: null,
      lastUpdatedAt: new Date()
    })),

    on(DashboardActions.loadDashboardFailure, (state, { error }): DashboardState => ({
      ...state,
      loadStatus: 'error',
      loadError: error
    }))
  ),

  extraSelectors: ({ selectData, selectLoadStatus, selectLoadError }) => ({
    selectIsLoading: createSelector(
      selectLoadStatus,
      (status) => status === 'loading'
    ),

    selectHasData: createSelector(
      selectData,
      (data) => !!data
    ),

    selectShowInitialLoading: createSelector(
      selectLoadStatus,
      selectData,
      (status, data) => status === 'loading' && !data
    ),

    selectIsRefreshing: createSelector(
      selectLoadStatus,
      selectData,
      (status, data) => status === 'loading' && !!data
    ),

    selectShowInitialError: createSelector(
      selectLoadStatus,
      selectLoadError,
      selectData,
      (status, error, data) => status === 'error' && !!error && !data
    ),

    selectShowRefreshError: createSelector(
      selectLoadStatus,
      selectLoadError,
      selectData,
      (status, error, data) => status === 'error' && !!error && !!data
    )
  })
});
