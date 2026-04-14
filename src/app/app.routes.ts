import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { loggedInGuard, notLoggedInGuard } from './core/auth/guards';
import { CategoriesFacade } from './features/categories/store';
import { UnitsFacade } from './features/units/store';

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
        loadChildren: () => import('./features/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories').then(m => m.CategoriesComponent),
        data: {
          title: 'Categories'
        },
        providers: [
          CategoriesFacade
        ]
      },
      {
        path: 'units',
        loadComponent: () => import('./features/units').then(m => m.UnitsComponent),
        data: {
          title: 'Units Of Measurement'
        },
        providers: [
          UnitsFacade
        ]
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products').then(m => m.ProductsComponent),
        data: {
          title: 'Products'
        }
      },
      {
        path: 'suppliers',
        loadChildren: () => import('./features/suppliers/routes').then(m => m.routes)
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customers/routes').then(m => m.routes)
      },
      {
        path: 'purchases',
        loadComponent: () => import('./features/purchases').then(m => m.PurchasesComponent),
        data: {
          title: 'Purchases'
        }
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders').then(m => m.OrdersComponent),
        data: {
          title: 'Orders'
        }
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users').then(m => m.routes)
      },
      {
        path: 'roles',
        loadChildren: () => import('./features/roles').then(m => m.routes)
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
