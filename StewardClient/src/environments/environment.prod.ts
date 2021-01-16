import { LogLevel } from '@services/logger/log-level';

import { StewardEnvironment } from './type';

/** Deployed to Prod */
export const environment: StewardEnvironment = {
  production: true,
  azureAppId: '796faca8-01de-436e-b75e-fb981756d5ed',
  azureAppScope: 'api://796faca8-01de-436e-b75e-fb981756d5ed/api_access',
  stewardUiUrl: 'https://steward-ui-prod.azurewebsites.net',
  stewardApiUrl: 'https://steward-api-prod.azurewebsites.net',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  enableFakeApi: true,
  appInsightsConfig: {
    instrumentationKey: '-- unable to create except for classic --',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Everything,
    consoleLogLevel: LogLevel.Nothing,
  },
};
