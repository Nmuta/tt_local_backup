import { StewardEnvironment } from './steward-environment';
import { environment as baseEnvProd } from './environment.prod';
import { environment as baseEnvLocal } from './environment.localUiDevApi';
import { cloneDeep } from 'lodash';
import { AllSecondaryAADScopes } from './app-data/aad';

export * from './app-data/aad';
export * from './app-data/hci';
export * from './app-data/tool-list';
export * from './app-data/tool-restrictions';

/** Dev in a prod-like configuration. */
const modifiedEnvironment: StewardEnvironment = cloneDeep(baseEnvLocal);
modifiedEnvironment.production = baseEnvProd.production;
modifiedEnvironment.stewardApiUrl = baseEnvProd.stewardApiUrl;
modifiedEnvironment.stewardUiStagingUrl = baseEnvProd.stewardUiStagingUrl;
modifiedEnvironment.stewardApiStagingUrl = baseEnvProd.stewardApiStagingUrl;
modifiedEnvironment.stewardBlobStorageUrl = baseEnvProd.stewardBlobStorageUrl;
modifiedEnvironment.azureAppId = baseEnvProd.azureAppId;
modifiedEnvironment.azureAppScope = baseEnvProd.azureAppScope;
modifiedEnvironment.tools = baseEnvProd.tools;

export const environment = modifiedEnvironment;
export const AllAADScopes: string[] = [...AllSecondaryAADScopes, environment.azureAppScope];
