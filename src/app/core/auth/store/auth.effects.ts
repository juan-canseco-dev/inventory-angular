import { Injectable, inject} from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, tap, exhaustMap, pipe } from 'rxjs';
import { AuthService } from '../service';
import {AuthActions} from './auth.actions';
import { UserDetails } from '../models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {

  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  signIn$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signIn),
    exhaustMap(({request}) =>
      this.authService.signIn(request).pipe(
        map((response) => {
          this.authService.setJwt(response.token)
          const user = this.authService.getUser();
          if (!user) {
            return AuthActions.signInFailure({error: 'Invalid token payload'});
          }
          return AuthActions.signInSuccess({response, user});
        }),
        catchError((error : HttpErrorResponse) => {
           const errorMessage = error?.status === 400
                ? 'Invalid Email or Password'
                : 'Server Error';
            return of(AuthActions.signInFailure({error: errorMessage}));
        })
      )
    )
  ));

  singInSuccessNavigate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      tap(() => this.router.navigateByUrl('/'))
    ),
    {functional: false, dispatch: false}
  );

  restoreAuthSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreAuthSession),
      map(() => {
        if (this.authService.isLoggedIn() === false) {
          return AuthActions.clearAuthSession();
        }
        let user : UserDetails = this.authService.getUser()!;
        return AuthActions.restoreAuthSessionSuccess({user: user});
      })
    )
  );

  onClearAuthSession$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.clearAuthSession),
      tap(() => this.authService.clearSession())
    ),
    {functional: false, dispatch: false}
  );

  onRestoreAuthSession$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.restoreAuthSessionSuccess),
    tap(() => this.authService.navigateToHome())
  ), {functional: false, dispatch: false});

  signOut$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signOut),
    map(() => AuthActions.signOutSuccess())
  ));

  onSignOutSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signOutSuccess),
    tap(() => this.authService.clearSession())
  ), {functional: false, dispatch: false});

}
