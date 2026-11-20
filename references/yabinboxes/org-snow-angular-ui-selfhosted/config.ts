import type { SnowRuntimeConfig } from './projects/dashboard/src/app/services/runtime-config';

export const dashboardConfig: SnowRuntimeConfig = {
  authProvider: 'gitlab',
  gitlab: {
    baseUrl: 'https://gitlab.com',
    clientId: '7cf898b95801beb65ebe37ef5608b39a8e5ba1baab455bfe62e026f3322fb08a',
    redirectUri: 'http://localhost:4200/login',
    scopes: 'read_user',
  },
  github: {
    baseUrl: 'https://github.com',
    clientId: 'Ov23liE1DarCLuAdSoI0',
    redirectUri: 'http://localhost:4200/login',
    scopes: 'read:user user:email',
  },
  api: {
    baseUrl: '',
    endpoints: {
      profile: '/connectors/profile',
      profileLicense: '/connectors/profile/license',
      profileToken: '/connectors/profile/snow-token-pipeline',
      snowDeployments: '/connectors/get-snow-deployments',
      tabs: '/connectors/tabs',
    },
  },
};
