import { LogLevel } from "@services/logger/log-level";

import { StewardEnvironment } from "./type";

// Local
export const environment: StewardEnvironment = {
  production: false,
  azureAppScope: 'api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access',
  clientUrl: 'http://localhost:4200',
  scrutineerApiUrl: 'https://localhost:44321',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  appInsightsConfig: {
    instrumentationKey: '1a0d253d-d7cf-4f59-af23-9ed1b11d0161',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Nothing,
    consoleLogLevel: LogLevel.Everything,
  },
};
