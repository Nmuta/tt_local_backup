import { LogLevel } from '@services/logger/log-level';

import { StewardEnvironment } from './type';

/** Local with Local API */
export const environment: StewardEnvironment = {
  production: false,
  azureAppId: '796faca8-01de-436e-b75e-fb981756d5ed',
  azureAppScope: 'api://796faca8-01de-436e-b75e-fb981756d5ed/api_access',
  stewardUiUrl: 'http://localhost:4200',
  stewardApiUrl: 'https://localhost:44321',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  enableFakeApi: true,
  appInsightsConfig: {
    instrumentationKey: '18e41d53-e8c7-465e-808d-ec4b1f9e5812',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Everything,
    consoleLogLevel: LogLevel.Everything,
  },
};
