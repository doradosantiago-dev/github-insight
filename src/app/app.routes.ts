import { Routes } from '@angular/router';

/**
 * Configuración de rutas de la aplicación.
 * 
 * @see https://angular.dev/guide/routing
 */
export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/search/search.component.js').then(
                (m) => m.SearchComponent
            ),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];

