import { CanActivateFn } from '@angular/router';
import { selectAuthState } from '../../store/auth.selector';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';


export const loggedInGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.pipe(select(selectAuthState)).pipe(
    filter(state => !state.isLoading),
    tap(state => {
      if (state.user === null) {
         router.navigateByUrl("auth")
      }
    }),
    map(state => state.user !== null)
  )
};
