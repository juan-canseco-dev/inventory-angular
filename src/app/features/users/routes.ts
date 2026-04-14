import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages').then(m => m.UsersComponent),
        data: {title: 'Users'}
    },
    {
        path: 'create',
        loadComponent: () => import('./pages').then(m => m.AddComponent),
        data: {
            title: 'Create'
        }
    },
    {
      path: 'edit',
      loadComponent: () => import('./pages').then(m => m.EditComponent),
       data: {
            title: 'Edit'
      }
    },
    {
      path: 'details',
      loadComponent: () => import('./pages').then(m => m.DetailsComponent),
      data: {
        title: 'Details'
      }
    }
]
