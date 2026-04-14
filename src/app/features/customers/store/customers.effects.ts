import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {  concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { CustomersService } from '../service';
import { CustomersActions } from './customers.actions';
import { customersFeature } from './customers.feature';
import { toApiError } from '../../../shared/utils';

@Injectable()
export class CustomersEffects {
  private readonly actions$ = inject(Actions);
  private readonly customersService = inject(CustomersService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.loadPage),
      switchMap(({ request }) =>
        this.customersService.getAll(request).pipe(
          map((page) => CustomersActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              CustomersActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  loadCustomerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.loadCustomerDetails),
      switchMap(({ customerId }) =>
        this.customersService.getById(customerId).pipe(
          map((details) => CustomersActions.loadCustomerDetailsSuccess({ details })),
          catchError((error) =>
            of(
              CustomersActions.loadCustomerDetailsFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.createCustomer),
      exhaustMap(({ request }) =>
        this.customersService.create(request).pipe(
          map((customerId) => CustomersActions.createCustomerSuccess({ customerId })),
          catchError((error) =>
            of(
              CustomersActions.createCustomerFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.updateCustomer),
      exhaustMap(({ request }) =>
        this.customersService.update(request).pipe(
          map(() => CustomersActions.updateCustomerSuccess()),
          catchError((error) =>
            of(
              CustomersActions.updateCustomerFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.deleteCustomer),
      exhaustMap(({ customerId }) =>
        this.customersService.delete(customerId).pipe(
          map(() => CustomersActions.deleteCustomerSuccess()),
          catchError((error) =>
            of(
              CustomersActions.deleteCustomerFailure({
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
        CustomersActions.createCustomerSuccess,
        CustomersActions.updateCustomerSuccess,
        CustomersActions.deleteCustomerSuccess
      ),
      concatLatestFrom(() => this.store.select(customersFeature.selectRequest)),
      map(([, request]) => CustomersActions.loadPage({ request }))
    )
  );
}
