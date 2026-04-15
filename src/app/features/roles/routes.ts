import { Routes } from '@angular/router';
import { hasPermissionGuard } from '../../core/auth/guards';
import { PermissionCatalog } from '../../core/permissions';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then(m => m.RolesComponent),
    data: { title: 'Roles' }
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/add').then(m => m.AddComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Create',
      permission: PermissionCatalog.Roles_Create
    }
  },
  {
    path: 'edit',
    loadComponent: () => import('./pages/edit').then(m => m.EditComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Edit',
      permission: PermissionCatalog.Roles_Update
    }
  },
  {
    path: 'details',
    loadComponent: () => import('./pages/details').then(m => m.DetailsComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Details',
      permission: PermissionCatalog.Roles_View
    }
  }
];
