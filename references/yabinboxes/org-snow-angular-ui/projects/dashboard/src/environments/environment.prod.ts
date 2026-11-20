export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDcSkq2eDd20gw0wjn_pPZxiTeNiF270qM",
    authDomain: "snow-angular-ui.firebaseapp.com",
    projectId: "snow-angular-ui",
    storageBucket: "snow-angular-ui.firebasestorage.app",
    messagingSenderId: "155893369352",
    appId: "1:155893369352:web:388c5e2fd34085fab79fbd",
    measurementId: "G-C7DEMECS6V"
  },
  api: {
    baseUrl: 'https://api.snow-monkeys.com/connectors',
    endpoints: {
      profile: '/profile',
      profileLicense: '/profile/license',
      profileToken: '/profile/snow-token-pipeline',
      snowDeployments: '/get-snow-deployments',
      snowDeploymentsPersistent: '/get-snow-deployments-persistent',
      tabs: '/tabs'
    }
  }
};
