import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SuppliersService } from '../service';
import { SuppliersActions } from './suppliers.actions';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { toApiError } from '../../../shared/utils';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { suppliersFeature } from './suppliers.reducers';

@Injectable()
export class SupplierEffects {

  private readonly actions$ = inject(Actions);
  private readonly suppliersService = inject(SuppliersService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuppliersActions.loadPage),
      switchMap(({ request }) =>
        this.suppliersService.getAll(request).pipe(
          map((page) => SuppliersActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              SuppliersActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  loadSupplierDetails$ = createEffect(() =>
  this.actions$.pipe(
    ofType(SuppliersActions.loadSupplierDetails),
    switchMap(({ supplierId }) =>
      this.suppliersService.getById(supplierId).pipe(
        map((details) => SuppliersActions.loadSupplierDetailsSuccess({ details })),
        catchError((error) =>
          of(SuppliersActions.loadSupplierDetailsFailure({ error: toApiError(error) }))
        )
      )
    )
  )
);

  createSupplier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuppliersActions.createSupplier),
      exhaustMap(({ request }) =>
        this.suppliersService.create(request).pipe(
          map((supplierId) =>
            SuppliersActions.createSupplierSuccess({ supplierId })
          ),
          catchError((error) =>
            of(
              SuppliersActions.createSupplierFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateSupplier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuppliersActions.updateSupplier),
      exhaustMap(({ request }) =>
        this.suppliersService.update(request).pipe(
          map(() => SuppliersActions.updateSupplierSuccess()),
          catchError((error) =>
            of(
              SuppliersActions.updateSupplierFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteSupplier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuppliersActions.deleteSupplier),
      exhaustMap(({ supplierId }) =>
        this.suppliersService.delete(supplierId).pipe(
          map(() => SuppliersActions.deleteSupplierSuccess()),
          catchError((error) =>
            of(
              SuppliersActions.deleteSupplierFailure({
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
        SuppliersActions.createSupplierSuccess,
        SuppliersActions.updateSupplierSuccess,
        SuppliersActions.deleteSupplierSuccess
      ),
      concatLatestFrom(() => this.store.select(suppliersFeature.selectRequest)),
      map(([, request]) => SuppliersActions.loadPage({ request }))
    )
  );
}
