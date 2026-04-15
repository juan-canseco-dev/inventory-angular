import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { GetCategoriesRequest } from '../../../features/categories/models';
import { CategoriesService } from '../../../features/categories/service/categories.service';
import { toApiError } from '../../utils';
import { GetRolesRequest } from '../../../features/roles/models';
import { RolesService } from '../../../features/roles/service';
import { GetSuppliersRequest } from '../../../features/suppliers/models';
import { SuppliersService } from '../../../features/suppliers/service/suppliers.service';
import { GetUnitsRequest } from '../../../features/units/models';
import { UnitsService } from '../../../features/units/service/units.service';
import { AutocompleteActions } from './autocomplete.actions';

@Injectable()
export class AutocompleteEffects {
  private readonly actions$ = inject(Actions);
  private readonly categoriesService = inject(CategoriesService);
  private readonly rolesService = inject(RolesService);
  private readonly suppliersService = inject(SuppliersService);
  private readonly unitsService = inject(UnitsService);

  loadCategoryOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AutocompleteActions.loadCategoryOptions),
      switchMap(({ query }) => {
        const request: GetCategoriesRequest = {
          pageNumber: 1,
          pageSize: 20,
          orderBy: 'name',
          sortOrder: 'asc',
          name: query.trim() || null
        };

        return this.categoriesService.getAll(request).pipe(
          map((page) => {
            const items = (page.items ?? []).map((category) => ({
              value: category.id,
              label: category.name
            }));

            return AutocompleteActions.loadCategoryOptionsSuccess({
              query,
              items
            });
          }),
          catchError((error) =>
            of(
              AutocompleteActions.loadCategoryOptionsFailure({
                query,
                error: toApiError(error)
              })
            )
          )
        );
      })
    )
  );

  loadRoleOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AutocompleteActions.loadRoleOptions),
      switchMap(({ query }) => {
        const request: GetRolesRequest = {
          pageNumber: 1,
          pageSize: 20,
          orderBy: 'name',
          sortOrder: 'asc',
          name: query.trim() || null
        };

        return this.rolesService.getAll(request).pipe(
          map((page) => {
            const items = (page.items ?? []).map((role) => ({
              value: role.id,
              label: role.name
            }));

            return AutocompleteActions.loadRoleOptionsSuccess({
              query,
              items
            });
          }),
          catchError((error) =>
            of(
              AutocompleteActions.loadRoleOptionsFailure({
                query,
                error: toApiError(error)
              })
            )
          )
        );
      })
    )
  );

  loadSupplierOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AutocompleteActions.loadSupplierOptions),
      switchMap(({ query }) => {
        const request: GetSuppliersRequest = {
          pageNumber: 1,
          pageSize: 20,
          orderBy: 'companyName',
          sortOrder: 'asc',
          compayName: query.trim() || null,
          contactName: null,
          contactPhone: null
        };

        return this.suppliersService.getAll(request).pipe(
          map((page) => {
            const items = (page.items ?? []).map((supplier) => ({
              value: supplier.id,
              label: supplier.companyName
            }));

            return AutocompleteActions.loadSupplierOptionsSuccess({
              query,
              items
            });
          }),
          catchError((error) =>
            of(
              AutocompleteActions.loadSupplierOptionsFailure({
                query,
                error: toApiError(error)
              })
            )
          )
        );
      })
    )
  );

  loadUnitOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AutocompleteActions.loadUnitOptions),
      switchMap(({ query }) => {
        const request: GetUnitsRequest = {
          pageNumber: 1,
          pageSize: 20,
          orderBy: 'name',
          sortOrder: 'asc',
          name: query.trim() || null
        };

        return this.unitsService.getAll(request).pipe(
          map((page) => {
            const items = (page.items ?? []).map((unit) => ({
              value: unit.id,
              label: unit.name
            }));

            return AutocompleteActions.loadUnitOptionsSuccess({
              query,
              items
            });
          }),
          catchError((error) =>
            of(
              AutocompleteActions.loadUnitOptionsFailure({
                query,
                error: toApiError(error)
              })
            )
          )
        );
      })
    )
  );
}
