import { UserDetails } from '../models';

export interface AuthState {
  user: UserDetails | null;
  isLoading: boolean;
  error: string | null;
};

export const authInitialState : AuthState = {
  user: null,
  isLoading: false,
  error: null
};
