import { Routes } from '@angular/router';
import { hasPermissionGuard } from '../../core/auth/guards';
import { PermissionCatalog } from '../../core/permissions';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages').then(m => m.OrdersComponent),
    data: { title: 'Orders' }
  },
  {
    path: 'create',
    loadComponent: () => import('./pages').then(m => m.AddComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Create',
      permission: PermissionCatalog.Orders_Create
    }
  },
  {
    path: 'edit',
    loadComponent: () => import('./pages').then(m => m.EditComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Edit',
      permission: PermissionCatalog.Orders_Update
    }
  },
  {
    path: 'details',
    loadComponent: () => import('./pages').then(m => m.DetailsComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Details',
      permission: PermissionCatalog.Orders_View
    }
  }
];
