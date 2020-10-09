import { LogLevel } from '@services/logger/log-level';

import { StewardEnvironment } from './type';

export const environment: StewardEnvironment = {
  production: true,
  azureAppScope: 'api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access',
  stewardUiUrl: 'https://steward-ui-prod.azurewebsites.net',
  stewardApiUrl: 'https://steward-api-prod.azurewebsites.net',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  appInsightsConfig: {
    instrumentationKey: '-- unable to create except for classic --',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Everything,
    consoleLogLevel: LogLevel.Nothing,
  },
};
