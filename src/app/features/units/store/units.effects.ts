import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UnitsService } from '../service';
import { UnitsActions } from './units.actions';
import { toApiError  } from '../../../shared/utils'
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { unitsFeature } from './units.readucers';

@Injectable()
export class UnitsEffects {
  private readonly actions$ = inject(Actions);
  private readonly unitsService = inject(UnitsService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.loadPage),
      switchMap(({ request }) =>
        this.unitsService.getAll(request).pipe(
          map((page) => UnitsActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              UnitsActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.createUnit),
      exhaustMap(({ request }) =>
        this.unitsService.create(request).pipe(
          map((unitId) =>
            UnitsActions.createUnitSuccess({ unitId })
          ),
          catchError((error) =>
            of(
              UnitsActions.createUnitFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.updateUnit),
      exhaustMap(({ request }) =>
        this.unitsService.update(request).pipe(
          map(() => UnitsActions.updateUnitSuccess()),
          catchError((error) =>
            of(
              UnitsActions.updateUnitFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.deleteUnit),
      exhaustMap(({ unitId }) =>
        this.unitsService.delete(unitId).pipe(
          map(() => UnitsActions.deleteUnitSuccess()),
          catchError((error) =>
            of(
              UnitsActions.deleteUnitFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  reloadCurrentPageAfterMutation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UnitsActions.createUnitSuccess,
        UnitsActions.updateUnitSuccess,
        UnitsActions.deleteUnitSuccess
      ),
      concatLatestFrom(() => this.store.select(unitsFeature.selectRequest)),
      map(([, request]) => UnitsActions.loadPage({ request }))
    )
  );
}
