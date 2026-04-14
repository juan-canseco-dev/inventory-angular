import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../service';
import { CategoriesActions } from './categories.actions';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { toApiError } from '../../../shared/utils'
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { categoriesFeature } from './categories.reducers';

@Injectable()
export class CategoriesEffects {
  private readonly actions$ = inject(Actions);
  private readonly categoriesService = inject(CategoriesService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.loadPage),
      switchMap(({ request }) =>
        this.categoriesService.getAll(request).pipe(
          map((page) => CategoriesActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              CategoriesActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.createCategory),
      exhaustMap(({ request }) =>
        this.categoriesService.create(request).pipe(
          map((categoryId) =>
            CategoriesActions.createCategorySuccess({ categoryId })
          ),
          catchError((error) =>
            of(
              CategoriesActions.createCategoryFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.updateCategory),
      exhaustMap(({ request }) =>
        this.categoriesService.update(request).pipe(
          map(() => CategoriesActions.updateCategorySuccess()),
          catchError((error) =>
            of(
              CategoriesActions.updateCategoryFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.deleteCategory),
      exhaustMap(({ categoryId }) =>
        this.categoriesService.delete(categoryId).pipe(
          map(() => CategoriesActions.deleteCategorySuccess()),
          catchError((error) =>
            of(
              CategoriesActions.deleteCategoryFailure({
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
        CategoriesActions.createCategorySuccess,
        CategoriesActions.updateCategorySuccess,
        CategoriesActions.deleteCategorySuccess
      ),
      concatLatestFrom(() => this.store.select(categoriesFeature.selectRequest)),
      map(([, request]) => CategoriesActions.loadPage({ request }))
    )
  );
}
