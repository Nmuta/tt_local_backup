import { LogLevel } from '@services/logger/log-level';
import { cloneDeep } from 'lodash';
import { overrideExternalTools, externalToolUrls } from './app-data/external-tool-urls';
import { unprocessedToolList } from './app-data/tool-list';
import { AllSecondaryAADScopes } from './app-data/aad';

import { StewardEnvironment } from './steward-environment';

export * from './app-data/aad';
export * from './app-data/hci';
export * from './app-data/tool-list';
export * from './app-data/tool-restrictions';

/** Local with Dev API */
export const environment: StewardEnvironment = {
  production: false,
  azureAppId: 'cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4',
  azureAppScope: 'api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access',
  stewardUiUrl: 'http://localhost:4200',
  stewardApiUrl: 'https://steward-api-dev.azurewebsites.net',
  stewardUiStagingUrl: 'NO_DEV_STAGING_SLOT',
  stewardApiStagingUrl: 'NO_DEV_STAGING_SLOT',
  stewardBlobStorageUrl: 'https://stewardblobdev.blob.core.windows.net',
  oldScrutineerApiUrl: 'https://prod-scrutineer.azurewebsites.net',
  adoVersion: 'ADO_VERSION_TO_REPLACE',
  enableFakeApi: true,
  appInsightsConfig: {
    instrumentationKey: '18e41d53-e8c7-465e-808d-ec4b1f9e5812',
    enableAutoRouteTracking: true, // option to log all route changes (do we want this?)
  },
  loggerConfig: {
    appInsightsLogLevel: LogLevel.Nothing,
    consoleLogLevel: LogLevel.Everything,
  },
  tools: overrideExternalTools(cloneDeep(unprocessedToolList), externalToolUrls.dev),
};

export const AllAADScopes: string[] = [...AllSecondaryAADScopes, environment.azureAppScope];
