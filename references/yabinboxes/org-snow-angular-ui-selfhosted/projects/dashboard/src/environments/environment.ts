// api.baseUrl is used only when docker-compose does not provide baseUrl.
export const environment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:8080',
    endpoints: {
      profile: '/connectors/profile',
      profileLicense: '/connectors/profile/license',
      profileToken: '/connectors/profile/snow-token-pipeline',
      snowDeployments: '/connectors/get-snow-deployments',
      tabs: '/connectors/tabs'
    }
  }
};
