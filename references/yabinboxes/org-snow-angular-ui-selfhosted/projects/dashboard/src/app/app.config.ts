import { ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/query-core';
import { gitlabAuthInterceptor } from './interceptors/gitlab-auth.interceptor';
import { GithubAuth } from './services/auth/github-auth';
import { GitlabAuth } from './services/auth/gitlab-auth';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) {
        return;
      }
      const gitlab = inject(GitlabAuth);
      const github = inject(GithubAuth);
      return gitlab.restoreSession().then(() => github.restoreSession());
    }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([gitlabAuthInterceptor])),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000
          },
          mutations: {
            retry: 1
          }
        }
      })
    ),
    provideMarkdown()
  ]
};
