import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { toApiError } from '../../../shared/utils';
import { OrdersService } from '../service';
import { OrdersActions } from './orders.actions';
import { ordersFeature } from './orders.feature';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);
  private readonly ordersService = inject(OrdersService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadPage),
      switchMap(({ request }) =>
        this.ordersService.getAll(request).pipe(
          map((page) => OrdersActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              OrdersActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  loadOrderDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrderDetails),
      switchMap(({ orderId }) =>
        this.ordersService.getById(orderId).pipe(
          map((details) => OrdersActions.loadOrderDetailsSuccess({ details })),
          catchError((error) =>
            of(
              OrdersActions.loadOrderDetailsFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.createOrder),
      exhaustMap(({ request }) =>
        this.ordersService.create(request).pipe(
          map((orderId) => OrdersActions.createOrderSuccess({ orderId })),
          catchError((error) =>
            of(
              OrdersActions.createOrderFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrder),
      exhaustMap(({ request }) =>
        this.ordersService.update(request).pipe(
          map(() => OrdersActions.updateOrderSuccess()),
          catchError((error) =>
            of(
              OrdersActions.updateOrderFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.deleteOrder),
      exhaustMap(({ orderId }) =>
        this.ordersService.delete(orderId).pipe(
          map(() => OrdersActions.deleteOrderSuccess()),
          catchError((error) =>
            of(
              OrdersActions.deleteOrderFailure({
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
        OrdersActions.createOrderSuccess,
        OrdersActions.updateOrderSuccess,
        OrdersActions.deleteOrderSuccess
      ),
      concatLatestFrom(() => this.store.select(ordersFeature.selectRequest)),
      map(([, request]) => OrdersActions.loadPage({ request }))
    )
  );
}
