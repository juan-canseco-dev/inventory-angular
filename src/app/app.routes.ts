import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { loggedInGuard, notLoggedInGuard, hasPermissionGuard } from './core/auth/guards';
import { CategoriesFacade } from './features/categories/store';
import { UnitsFacade } from './features/units/store';
import { PermissionCatalog } from './core/permissions';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [loggedInGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/routes').then((m) => m.routes),
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories').then(m => m.CategoriesComponent),
        canActivate: [hasPermissionGuard],
        data: {
          title: 'Categories',
          permission: PermissionCatalog.Categories_View
        },
        providers: [
          CategoriesFacade
        ]
      },
      {
        path: 'units',
        loadComponent: () => import('./features/units').then(m => m.UnitsComponent),
        canActivate: [hasPermissionGuard],
        data: {
          title: 'Units Of Measurement',
          permission: PermissionCatalog.Units_View
        },
        providers: [
          UnitsFacade
        ]
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/routes').then(m => m.routes),
        canActivateChild: [hasPermissionGuard],
        data: {
          permission: PermissionCatalog.Products_View
        }
      },
      {
        path: 'suppliers',
        loadChildren: () => import('./features/suppliers/routes').then(m => m.routes),
        canActivateChild: [hasPermissionGuard],
        data: {
          permission: PermissionCatalog.Suppliers_View
        }
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customers/routes').then(m => m.routes),
        canActivateChild: [hasPermissionGuard],
        data: {
          permission: PermissionCatalog.Customers_View
        }
      },
      {
        path: 'purchases',
        loadChildren: () => import('./features/purchases/routes').then(m => m.routes),
        canActivateChild: [hasPermissionGuard],
        data: {
          permission: PermissionCatalog.Purchases_View
        }
      },
      {
        path: 'orders',
        loadChildren: () => import('./features/orders/routes').then(m => m.routes),
        canActivateChild: [hasPermissionGuard],
        data: {
          permission: PermissionCatalog.Orders_View
        }
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users').then(m => m.routes),
        canActivateChild: [hasPermissionGuard],
        data: {
          permission: PermissionCatalog.Users_View
        }
      },
      {
        path: 'roles',
        loadChildren: () => import('./features/roles').then(m => m.routes),
        canActivateChild: [hasPermissionGuard],
        data: {
          permission: PermissionCatalog.Roles_View
        }
      },
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/pages/sign-in').then(m => m.SignInComponent),
    canActivate: [notLoggedInGuard]
  },
  {
    path: '404',
    loadComponent: () => import('./features/system/pages/page404').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./features/system/pages/page500').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
