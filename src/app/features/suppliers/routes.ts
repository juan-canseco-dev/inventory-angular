import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../suppliers/pages').then(m => m.SuppliersComponent),
        data: {title: 'Suppliers'}
    },
    {
        path: 'create',
        loadComponent: () => import('../suppliers/pages').then(m => m.AddComponent),
        data: {
            title: 'Create'
        }
    },
    {
      path: 'edit',
      loadComponent: () => import('../suppliers/pages').then(m => m.EditComponent),
       data: {
            title: 'Edit'
      }
    },
    {
      path: 'details',
      loadComponent: () => import('../suppliers/pages').then(m => m.DetailsComponent),
      data: {
        title: 'Details'
      }
    }
]
