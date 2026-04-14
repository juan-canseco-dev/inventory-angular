import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home').then(m => m.ProductsComponent),
        data: {title: 'Products'}
    },
    {
        path: 'create',
        loadComponent: () => import('./pages/add').then(m => m.AddComponent),
        data: {
            title: 'Create'
        }
    },
    {
      path: 'edit',
      loadComponent: () => import('./pages/edit').then(m => m.EditComponent),
       data: {
            title: 'Edit'
      }
    },
    {
      path: 'details',
      loadComponent: () => import('./pages/details').then(m => m.DetailsComponent),
      data: {
        title: 'Details'
      }
    }
]
