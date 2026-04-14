import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home').then(m => m.CustomersComponent),
        data: {title: 'Customers'}
    },
    {
        path: 'create',
        loadComponent: () => import('./pages/add').then(m => m.AddCustomerComponent),
        data: {
            title: 'Create'
        }
    },
    {
      path: 'edit',
      loadComponent: () => import('./pages/edit').then(m => m.EditCustomerComponent),
       data: {
            title: 'Edit'
      }
    },
    {
      path: 'details',
      loadComponent: () => import('./pages/details').then(m => m.DetailsCustomerComponent),
      data: {
        title: 'Details'
      }
    }
]
