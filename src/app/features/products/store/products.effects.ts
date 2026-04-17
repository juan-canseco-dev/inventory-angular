import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { toApiError } from '../../../shared/utils';
import { ProductsService } from '../service';
import { ProductsActions } from './products.actions';
import { productsFeature } from './products.feature';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly productsService = inject(ProductsService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadPage),
      switchMap(({ request }) =>
        this.productsService.getAll(request).pipe(
          map((page) => ProductsActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              ProductsActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  loadProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProductDetails),
      switchMap(({ productId }) =>
        this.productsService.getById(productId).pipe(
          map((details) => ProductsActions.loadProductDetailsSuccess({ details })),
          catchError((error) =>
            of(
              ProductsActions.loadProductDetailsFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.createProduct),
      exhaustMap(({ request }) =>
        this.productsService.create(request).pipe(
          map((productId) => ProductsActions.createProductSuccess({ productId })),
          catchError((error) =>
            of(
              ProductsActions.createProductFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateProduct),
      exhaustMap(({ request }) =>
        this.productsService.update(request).pipe(
          map(() => ProductsActions.updateProductSuccess()),
          catchError((error) =>
            of(
              ProductsActions.updateProductFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.deleteProduct),
      exhaustMap(({ productId }) =>
        this.productsService.delete(productId).pipe(
          map(() => ProductsActions.deleteProductSuccess()),
          catchError((error) =>
            of(
              ProductsActions.deleteProductFailure({
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
        ProductsActions.createProductSuccess,
        ProductsActions.updateProductSuccess,
        ProductsActions.deleteProductSuccess
      ),
      concatLatestFrom(() => this.store.select(productsFeature.selectRequest)),
      map(([, request]) => ProductsActions.loadPage({ request }))
    )
  );
}
