import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./../pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'tools',
    loadComponent: () => import('./../pages/tools/tools').then(m => m.ToolsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  },
];