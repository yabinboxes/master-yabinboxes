import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { loadRuntimeConfig } from './app/services/runtime-config';

const bootstrap = (context: BootstrapContext) => {
  loadRuntimeConfig(process.env['baseUrl']);
  return bootstrapApplication(App, config, context);
};

export default bootstrap;
