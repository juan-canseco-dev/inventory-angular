import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardRequest } from '../models';
import { DashboardActions } from './dashboard.actions';
import { dashboardFeature } from './dashboard.feature';

@Injectable({
  providedIn: 'root'
})
export class DashboardFacade {
  private readonly store = inject(Store);

  readonly data = this.store.selectSignal(dashboardFeature.selectData);
  readonly request = this.store.selectSignal(dashboardFeature.selectRequest);
  readonly loading = this.store.selectSignal(dashboardFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(dashboardFeature.selectLoadError);
  readonly hasData = this.store.selectSignal(dashboardFeature.selectHasData);
  readonly showInitialLoading = this.store.selectSignal(dashboardFeature.selectShowInitialLoading);
  readonly isRefreshing = this.store.selectSignal(dashboardFeature.selectIsRefreshing);
  readonly showInitialError = this.store.selectSignal(dashboardFeature.selectShowInitialError);
  readonly showRefreshError = this.store.selectSignal(dashboardFeature.selectShowRefreshError);
  readonly lastUpdatedAt = this.store.selectSignal(dashboardFeature.selectLastUpdatedAt);

  loadDashboard(request: DashboardRequest): void {
    this.store.dispatch(DashboardActions.loadDashboard({ request }));
  }

  connectUpdates(): void {
    this.store.dispatch(DashboardActions.connectUpdates());
  }

  disconnectUpdates(): void {
    this.store.dispatch(DashboardActions.disconnectUpdates());
  }
}
