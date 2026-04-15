import { Routes } from '@angular/router';
import { hasPermissionGuard } from '../../core/auth/guards';
import { PermissionCatalog } from '../../core/permissions';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages').then(m => m.UsersComponent),
    data: { title: 'Users' }
  },
  {
    path: 'create',
    loadComponent: () => import('./pages').then(m => m.AddComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Create',
      permission: PermissionCatalog.Users_Create
    }
  },
  {
    path: 'edit',
    loadComponent: () => import('./pages').then(m => m.EditComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Edit',
      permission: PermissionCatalog.Users_Update
    }
  },
  {
    path: 'details',
    loadComponent: () => import('./pages').then(m => m.DetailsComponent),
    canActivate: [hasPermissionGuard],
    data: {
      title: 'Details',
      permission: PermissionCatalog.Users_View
    }
  }
];
