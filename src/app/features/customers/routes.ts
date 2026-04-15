import { PermissionCatalog } from './../../core/permissions/models/catalog';
import { Routes } from "@angular/router";
import { hasPermissionGuard} from '../../core/auth/guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home').then(m => m.CustomersComponent),
        data: {title: 'Customers'}
    },
    {
        path: 'create',
        loadComponent: () => import('./pages/add').then(m => m.AddCustomerComponent),
        canActivate: [hasPermissionGuard],
        data: {
            title: 'Create',
            permission: PermissionCatalog.Customers_Create
        }
    },
    {
      path: 'edit',
      loadComponent: () => import('./pages/edit').then(m => m.EditCustomerComponent),
      canActivate: [hasPermissionGuard],
       data: {
            title: 'Edit',
            permission: PermissionCatalog.Customers_Update
      }
    },
    {
      path: 'details',
      loadComponent: () => import('./pages/details').then(m => m.DetailsCustomerComponent),
      canActivate: [hasPermissionGuard],
      data: {
        title: 'Details',
        permission: PermissionCatalog.Customers_View
      }
    }
]
