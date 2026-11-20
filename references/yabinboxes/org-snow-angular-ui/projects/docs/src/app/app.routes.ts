import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';

/** Matches /docs/provider/:provider/examples and any nested example file. */
export function providerExamplesMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length < 3 || segments[0].path !== 'provider' || segments[2].path !== 'examples') {
    return null;
  }

  const file = segments.slice(3).map((segment) => segment.path).join('/');
  return {
    consumed: segments,
    posParams: {
      provider: segments[1],
      exampleFile: new UrlSegment(file || 'README.md', {}),
    },
  };
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'docs/home',
    pathMatch: 'full',
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/dashboard/dashboard'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'modules',
        loadComponent: () => import('./pages/modules/modules'),
      },
      {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview'),
      },
      {
        path: 'snow-monkeys/:mdFile',
        loadComponent: () => import('./pages/snow-monkeys/snow-monkeys'),
      },
      {
        path: 'get-started/:mdFile',
        loadComponent: () => import('./pages/get-started/get-started'),
      },
      {
        matcher: providerExamplesMatcher,
        loadComponent: () => import('./pages/provider-example/provider-example'),
      },
      {
        path: 'provider/:provider/:mdFile',
        loadComponent: () => import('./pages/provider/provider'),
      },
      {
        path: 'reporting',
        loadComponent: () => import('./pages/reporting/reporting'),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'docs/home',
  },
];
