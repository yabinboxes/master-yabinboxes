import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { loadRuntimeConfig } from './app/services/runtime-config';

async function readBootstrapBaseUrl(): Promise<string | undefined> {
  try {
    const response = await fetch('/bootstrap-config.json', { cache: 'no-store' });
    if (!response.ok) return undefined;
    const body = (await response.json()) as { baseUrl?: unknown };
    return typeof body.baseUrl === 'string' && body.baseUrl.trim() ? body.baseUrl : undefined;
  } catch {
    return undefined;
  }
}

readBootstrapBaseUrl()
  .then((baseUrl) => {
    loadRuntimeConfig(baseUrl);
    return bootstrapApplication(App, appConfig);
  })
  .catch((err) => console.error(err));
