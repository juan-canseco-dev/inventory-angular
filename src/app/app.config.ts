import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule} from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from '.././app/core/auth/interceptors/auth';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ROOT_REDUCERS, ROOT_EFFECTS  } from './core/store';

export function tokenGetter() {
  return localStorage.getItem("token");
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({
        onSameUrlNavigation: 'reload'
    }), withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
    }), withEnabledBlockingInitialNavigation(), withViewTransitions(), withHashLocation()),
    importProvidersFrom(SidebarModule, DropdownModule, JwtModule.forRoot({
        config: {
            tokenGetter: tokenGetter,
            allowedDomains: ["localhost:8080"]
        }
    })),
    IconSetService,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync(),
    provideStore(ROOT_REDUCERS),
    provideEffects(ROOT_EFFECTS),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
