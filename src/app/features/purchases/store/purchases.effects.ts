import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { toApiError } from '../../../shared/utils';
import { PurchasesService } from '../service';
import { PurchasesActions } from './purchases.actions';
import { purchasesFeature } from './purchases.feature';

@Injectable()
export class PurchasesEffects {
  private readonly actions$ = inject(Actions);
  private readonly purchasesService = inject(PurchasesService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.loadPage),
      switchMap(({ request }) =>
        this.purchasesService.getAll(request).pipe(
          map((page) => PurchasesActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              PurchasesActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  loadPurchaseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.loadPurchaseDetails),
      switchMap(({ purchaseId }) =>
        this.purchasesService.getById(purchaseId).pipe(
          map((details) => PurchasesActions.loadPurchaseDetailsSuccess({ details })),
          catchError((error) =>
            of(
              PurchasesActions.loadPurchaseDetailsFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  createPurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.createPurchase),
      exhaustMap(({ request }) =>
        this.purchasesService.create(request).pipe(
          map((purchaseId) => PurchasesActions.createPurchaseSuccess({ purchaseId })),
          catchError((error) =>
            of(
              PurchasesActions.createPurchaseFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updatePurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.updatePurchase),
      exhaustMap(({ request }) =>
        this.purchasesService.update(request).pipe(
          map(() => PurchasesActions.updatePurchaseSuccess()),
          catchError((error) =>
            of(
              PurchasesActions.updatePurchaseFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deletePurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.deletePurchase),
      exhaustMap(({ purchaseId }) =>
        this.purchasesService.delete(purchaseId).pipe(
          map(() => PurchasesActions.deletePurchaseSuccess()),
          catchError((error) =>
            of(
              PurchasesActions.deletePurchaseFailure({
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
        PurchasesActions.createPurchaseSuccess,
        PurchasesActions.updatePurchaseSuccess,
        PurchasesActions.deletePurchaseSuccess
      ),
      concatLatestFrom(() => this.store.select(purchasesFeature.selectRequest)),
      map(([, request]) => PurchasesActions.loadPage({ request }))
    )
  );
}
