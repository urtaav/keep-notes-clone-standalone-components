import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '', loadComponent: () => import('./components/main/main.component').then(c => c.MainComponent)
  },
  {
    path: 'archive', loadComponent: () => import('./components/main/main.component').then(c => c.MainComponent)
  },
  {
    path: 'trash', loadComponent: () => import('./components/main/main.component').then(c => c.MainComponent)
  },
  {
    path: 'label/:name', loadComponent: () => import('./components/main/main.component').then(c => c.MainComponent)
  },
  { path: '', redirectTo: 'users', pathMatch: 'full' },

];