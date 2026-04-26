import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { DashboardEffects, dashboardFeature } from './store';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: $localize`Dashboard`
    },
    providers: [
      provideState(dashboardFeature),
      provideEffects(DashboardEffects)
    ]
  }
];

