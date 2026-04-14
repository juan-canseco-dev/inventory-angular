import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

export const selectAuthState = authFeature.selectAuthState;
export const selectAuthUser = authFeature.selectUser;
export const selectAuthIsLoading = authFeature.selectIsLoading;
export const selectAuthError = authFeature.selectError;

export const selectAuthPermissions = createSelector(
  selectAuthUser,
  (user) => user?.permissions ?? []
);
