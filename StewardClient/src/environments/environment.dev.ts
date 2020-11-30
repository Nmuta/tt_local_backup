import { LogLevel } from '@services/logger/log-level';

import { StewardEnvironment } from './type';

/** Deployed to Dev */
export const environment: StewardEnvironment = {
  production: false,
  azureAppId: '48a8a430-0f6b-4469-940f-1c5c6af1fd88',
  azureAppScope: 'api://48a8a430-0f6b-4469-940f-1c5c6af1fd88/api_access',
  stewardUiUrl: 'https://steward-ui-dev.azurewebsites.net',
  stewardApiUrl: 'https://steward-api-dev.azurewebsites.net',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
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
