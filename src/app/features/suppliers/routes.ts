import { Routes } from '@angular/router';
import { hasPermissionGuard } from '../../core/auth/guards';
import { PermissionCatalog } from '../../core/permissions';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../suppliers/pages').then(m => m.SuppliersComponent),
    data: { title: 'Suppliers' }
  },
  {
    path: 'create',
    loadComponent: () => import('../suppliers/pages').then(m => m.AddComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Create',
      permission: PermissionCatalog.Suppliers_Create
    }
  },
  {
    path: 'edit',
    loadComponent: () => import('../suppliers/pages').then(m => m.EditComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Edit',
      permission: PermissionCatalog.Suppliers_Update
    }
  },
  {
    path: 'details',
    loadComponent: () => import('../suppliers/pages').then(m => m.DetailsComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Details',
      permission: PermissionCatalog.Suppliers_View
    }
  }
];
