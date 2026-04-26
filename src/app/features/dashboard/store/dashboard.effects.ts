import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { catchError, map, of, switchMap, takeUntil } from 'rxjs';
import { toApiError } from '../../../shared/utils';
import { DashboardService } from '../service';
import { DashboardActions } from './dashboard.actions';
import { dashboardFeature } from './dashboard.feature';

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly dashboardService = inject(DashboardService);
  private readonly store = inject(Store);

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      switchMap(({ request }) =>
        this.dashboardService.getDashboardData(request).pipe(
          map((data) => DashboardActions.loadDashboardSuccess({ data })),
          catchError((error) =>
            of(
              DashboardActions.loadDashboardFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  connectUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.connectUpdates),
      switchMap(() =>
        this.dashboardService.watchUpdates().pipe(
          map((message) => DashboardActions.updateSignalReceived({ message })),
          takeUntil(this.actions$.pipe(ofType(DashboardActions.disconnectUpdates)))
        )
      )
    )
  );

  reloadDashboardAfterSignal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.updateSignalReceived),
      concatLatestFrom(() => this.store.select(dashboardFeature.selectRequest)),
      map(([, request]) => DashboardActions.loadDashboard({ request }))
    )
  );
}
