import { LogLevel } from '@services/logger/log-level';

import { StewardEnvironment } from './type';

/** Deployed to Dev */
export const environment: StewardEnvironment = {
  production: false,
  azureAppId: 'cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4',
  azureAppScope: 'api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access',
  stewardUiUrl: 'https://steward-ui-dev.azurewebsites.net',
  stewardApiUrl: 'https://steward-api-dev.azurewebsites.net',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  adoVersion: 'ADO_VERSION_TO_REPLACE',
  enableFakeApi: false,
  appInsightsConfig: {
    instrumentationKey: '18e41d53-e8c7-465e-808d-ec4b1f9e5812',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Everything,
    consoleLogLevel: LogLevel.Everything,
  },
};
