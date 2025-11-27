import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { loggedInGuard } from './core/guards/logged-in';
import { notLoggedInGuard } from './core/guards/not-logged-in';

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
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'categories',
        loadComponent: () => import('./views/categories').then(m => m.CategoriesComponent),
        data: {
          title: 'Categories'
        }
      },
      {
        path: 'units',
        loadComponent: () => import('./views/units').then(m => m.UnitsComponent),
        data: {
          title: 'Units Of Measurement'
        }
      },
      {
        path: 'products',
        loadComponent: () => import('./views/products').then(m => m.ProductsComponent),
        data: {
          title: 'Products'
        }
      },
      {
        path: 'suppliers',
        loadChildren: () => import('./views/suppliers/routes').then(m => m.routes)
      },
      {
        path: 'purchases',
        loadComponent: () => import('./views/purchases').then(m => m.PurchasesComponent),
        data: {
          title: 'Purchases'
        }
      },
      {
        path: 'orders',
        loadComponent: () => import('./views/orders').then(m => m.OrdersComponent),
        data: {
          title: 'Orders'
        }
      },
      {
        path: 'users',
        loadComponent: () => import('./views/users').then(m => m.UsersComponent),
        data: {
          title: 'Users'
        }

      },
      {
        path: 'Roles',
        loadComponent: () => import('./views/roles').then(m => m.RolesComponent),
        data: {
          title: 'Roles'
        }
      },
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./views/auth/sign-in').then(m => m.SignInComponent),
    canActivate: [notLoggedInGuard]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
