import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./suppliers.component').then(m => m.SuppliersComponent),
        data: {title: 'Suppliers'}
    },
    {
        path: 'create',
        loadComponent: () => import('./add').then(m => m.AddComponent),
        data: {
            title: 'Create'
        }
    }
]