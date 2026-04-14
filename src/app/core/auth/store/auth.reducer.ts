import { createFeature, createReducer, on} from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { authInitialState } from './auth.state';;

const reducer = createReducer(
  authInitialState,
  on(AuthActions.signIn, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.signInSuccess, (state, { user}) => ({
    ...state,
    user: user,
    isLoading: false,
    error: null
  })),

  on(AuthActions.signInFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error: error
  })),

  on(AuthActions.restoreAuthSession, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.restoreAuthSessionSuccess, (state, {  user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),

  on(AuthActions.clearAuthSession, (state) => ({
    ...state,
    user: null,
    isLoading: false,
    error: null
  })),

  on(AuthActions.signOut, () => ({
    ...authInitialState
  })),

on(AuthActions.signOutSuccess, () => ({
    ...authInitialState
  })),

);


export const authFeature = createFeature({
  name: 'auth',
  reducer: reducer
});
