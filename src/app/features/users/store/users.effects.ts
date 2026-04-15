import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { toApiError } from '../../../shared/utils';
import { UsersService } from '../service';
import { UsersActions } from './users.actions';
import { usersFeature } from './users.feature';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly usersService = inject(UsersService);
  private readonly store = inject(Store);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadPage),
      switchMap(({ request }) =>
        this.usersService.getAll(request).pipe(
          map((page) => UsersActions.loadPageSuccess({ page })),
          catchError((error) =>
            of(
              UsersActions.loadPageFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  loadUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUserDetails),
      switchMap(({ userId }) =>
        this.usersService.getById(userId).pipe(
          map((details) => UsersActions.loadUserDetailsSuccess({ details })),
          catchError((error) =>
            of(
              UsersActions.loadUserDetailsFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      exhaustMap(({ request }) =>
        this.usersService.create(request).pipe(
          map((userId) => UsersActions.createUserSuccess({ userId })),
          catchError((error) =>
            of(
              UsersActions.createUserFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap(({ request }) =>
        this.usersService.update(request).pipe(
          map(() => UsersActions.updateUserSuccess()),
          catchError((error) =>
            of(
              UsersActions.updateUserFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  changeUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.changeUserRole),
      exhaustMap(({ request }) =>
        this.usersService.changeRole(request).pipe(
          map(() => UsersActions.changeUserRoleSuccess()),
          catchError((error) =>
            of(
              UsersActions.changeUserRoleFailure({
                error: toApiError(error)
              })
            )
          )
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      exhaustMap(({ userId }) =>
        this.usersService.delete(userId).pipe(
          map(() => UsersActions.deleteUserSuccess()),
          catchError((error) =>
            of(
              UsersActions.deleteUserFailure({
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
        UsersActions.createUserSuccess,
        UsersActions.updateUserSuccess,
        UsersActions.changeUserRoleSuccess,
        UsersActions.deleteUserSuccess
      ),
      concatLatestFrom(() => this.store.select(usersFeature.selectRequest)),
      map(([, request]) => UsersActions.loadPage({ request }))
    )
  );
}
