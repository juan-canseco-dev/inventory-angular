import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions,  createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { toApiError } from '../../../shared/utils';
import { PermissionsService } from '../../../core/permissions';
import { RolesService } from '../service';
import { rolesFeature } from './roles.feature';
import { RolesActions } from './roles.actions';

@Injectable()
export class RoleEffects {
  private readonly actions$ = inject(Actions);
  private readonly rolesService = inject(RolesService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadPage),
      switchMap(({ request }) =>
        this.rolesService.getAll(request).pipe(
          map((page) => RolesActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              RolesActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  loadRoleDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoleDetails),
      switchMap(({ roleId }) =>
        this.rolesService.getById(roleId).pipe(
          map((details) => RolesActions.loadRoleDetailsSuccess({ details })),
          catchError((error) =>
            of(RolesActions.loadRoleDetailsFailure({ error: toApiError(error) }))
          )
        )
      )
    )
  );

  loadPermissionGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadPermissionGroups),
      switchMap(() =>
        this.permissionsService.getAll().pipe(
          map((permissionGroups) =>
            RolesActions.loadPermissionGroupsSuccess({ permissionGroups })
          ),
          catchError((error) =>
            of(RolesActions.loadPermissionGroupsFailure({ error: toApiError(error) }))
          )
        )
      )
    )
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createRole),
      exhaustMap(({ request }) =>
        this.rolesService.create(request).pipe(
          map((roleId) => RolesActions.createRoleSuccess({ roleId })),
          catchError((error) =>
            of(
              RolesActions.createRoleFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.updateRole),
      exhaustMap(({ request }) =>
        this.rolesService.update(request).pipe(
          map(() => RolesActions.updateRoleSuccess()),
          catchError((error) =>
            of(
              RolesActions.updateRoleFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.deleteRole),
      exhaustMap(({ roleId }) =>
        this.rolesService.delete(roleId).pipe(
          map(() => RolesActions.deleteRoleSuccess()),
          catchError((error) =>
            of(
              RolesActions.deleteRoleFailure({
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
        RolesActions.createRoleSuccess,
        RolesActions.updateRoleSuccess,
        RolesActions.deleteRoleSuccess
      ),
      concatLatestFrom(() => this.store.select(rolesFeature.selectRequest)),
      map(([, request]) => RolesActions.loadPage({ request }))
    )
  );
}
