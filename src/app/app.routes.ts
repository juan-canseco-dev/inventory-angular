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
        loadComponent: () => import('./views/categories').then(m => m.CategoriesComponent)
      },
      {
        path: 'units',
        loadComponent: () => import('./views/units').then(m => m.UnitsComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./views/products').then(m => m.ProductsComponent)
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./views/suppliers').then(m => m.SuppliersComponent)
      },
      {
        path: 'purchases',
        loadComponent: () => import('./views/purchases').then(m => m.PurchasesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./views/orders').then(m => m.OrdersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./views/users').then(m => m.UsersComponent)
        
      },
      {
        path: 'roles',
        loadComponent: () => import('./views/roles').then(m => m.RolesComponent)
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
