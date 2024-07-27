import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: 'products',
        loadComponent: () => import('./features/stock-list/stock-list.component')
    },
   
    { 
        path: 'addProduct',
        loadComponent: () => import('./features/add-and-update-product/add-and-update-product.component')
    },

    { 
        path: 'updateProduct/:id',
        loadComponent: () => import('./features/add-and-update-product/add-and-update-product.component')
    },
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: '**', redirectTo: 'products', pathMatch: 'full' },
];
