import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { firstTimeEntryGuard } from './guards/first-time-entry.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [firstTimeEntryGuard],
    loadComponent: () => import('./pages/login/login'),
  },
  {
    path: 'settings-first-time-configs',
    loadComponent: () => import('./pages/settings-first-time-configs/settings-first-time-configs'),
  },
  {
    path: 'backend-unavailable',
    loadComponent: () => import('./pages/backend-unavailable/backend-unavailable'),
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [firstTimeEntryGuard],
    loadComponent: () => import('./pages/login/login'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        // Default dashboard view (resources list).
        loadComponent: () => import('./pages/dashboard/sources/sources'),
        canActivate: [authGuard],
      },
      {
        path: 'history', 
        loadComponent: () => import('./pages/dashboard/sources-history/sources-history'),
        canActivate: [authGuard],
      },
      {
        path: 'easy-deployment',
        loadComponent: () => import('./pages/dashboard/easy-deployment/easy-deployment'),
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/dashboard/settings/settings'),
        canActivate: [authGuard],
      },
      // Deprecated: import screen is not routed.
      // {
      //   path: 'import',
      //   loadComponent: () => import('./pages/dashboard/import/import'),
      //   canActivate: [authGuard],
      // },
      {
        path: 'reports',
        loadComponent: () => import('./pages/dashboard/reports/reports'),
        canActivate: [authGuard],
      },
      {
        path: 'self-license',
        loadComponent: () => import('./pages/dashboard/self-license/self-license'),
        canActivate: [authGuard],
      },
      {
        path: 'individual-license',
        loadComponent: () => import('./pages/dashboard/individual-license/individual-license'),
        canActivate: [authGuard],
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: 'dashboard-test',
    loadComponent: () => import('./pages/dashboard/dashboard'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/sources/sources'),
      },
      // Deprecated: import screen is not routed.
      // {
      //   path: 'import',
      //   loadComponent: () => import('./pages/dashboard/import/import'),
      // },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/notfound/notfound'),
  },
];
