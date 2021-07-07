import { LogLevel } from '@services/logger/log-level';

import { StewardEnvironment } from './steward-environment';

/** Deployed to Prod */
export const environment: StewardEnvironment = {
  production: true,
  azureAppId: '796faca8-01de-436e-b75e-fb981756d5ed',
  azureAppScope: 'api://796faca8-01de-436e-b75e-fb981756d5ed/api_access',
  stewardUiUrl: 'https://steward-ui-prod.azurewebsites.net',
  stewardApiUrl: 'https://steward-api-prod.azurewebsites.net',
  stewardUiStagingUrl: 'https://steward-ui-prod-staging.azurewebsites.net',
  stewardApiStagingUrl: 'https://steward-api-prod-staging.azurewebsites.net',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  adoVersion: 'ADO_VERSION_TO_REPLACE',
  enableFakeApi: true,
  appInsightsConfig: {
    instrumentationKey: 'bbbacd1f-d95e-451f-819a-97c787edc628',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Everything,
    consoleLogLevel: LogLevel.Nothing,
  },
  salusUrl: 'https://gamingmoderation.azureedge.net/#/dashboard',
};
