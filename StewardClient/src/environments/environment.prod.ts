import { LogLevel } from "@services/logger";

import { StewardEnvironment } from "./type";

export const environment: StewardEnvironment = {
  production: true,
  azureAppScope: 'api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access',
  clientUrl: 'https://scrutineer-ui-prod.azurewebsites.net',
  scrutineerApiUrl: 'https://scrutineer-api-prod.azurewebsites.net',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  appInsightsConfig: {
    instrumentationKey: 'ae6985a0-4100-437a-95da-199cb8e993c1',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Everything,
    consoleLogLevel: LogLevel.Nothing,
  },
};
