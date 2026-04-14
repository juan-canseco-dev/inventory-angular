import { JwtResponse, SignInRequest, UserDetails } from "../models";
import { createActionGroup, emptyProps, props} from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Sign In': props<{request: SignInRequest}>(),
    'Sign In Success': props<{response: JwtResponse, user: UserDetails}>(),
    'Sign In Failure': props<{error: string}>(),
    'Restore Auth Session': emptyProps(),
    'Restore Auth Session Success': props<{ user: UserDetails }>(),
    'Clear Auth Session': emptyProps(),
    'Sign Out': emptyProps(),
    'Sign Out Success': emptyProps()
  }
});
