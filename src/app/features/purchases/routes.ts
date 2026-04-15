import { Routes } from '@angular/router';
import { hasPermissionGuard } from '../../core/auth/guards';
import { PermissionCatalog } from '../../core/permissions';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then(m => m.PurchasesComponent),
    data: { title: 'Purchases' }
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/add').then(m => m.AddComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Create',
      permission: PermissionCatalog.Purchases_Create
    }
  },
  {
    path: 'edit',
    loadComponent: () => import('./pages/edit').then(m => m.EditComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Edit',
      permission: PermissionCatalog.Purchases_Update
    }
  },
  {
    path: 'details',
    loadComponent: () => import('./pages/details').then(m => m.DetailsComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Details',
      permission: PermissionCatalog.Purchases_View
    }
  }
];
