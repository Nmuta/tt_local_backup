import { StewardEnvironment } from './steward-environment';
import { environment as baseEnvProd } from './environment.prod';
import { environment as baseEnvLocal } from './environment.localUiDevApi';
import { cloneDeep } from 'lodash';

/** Dev in a prod-like configuration. */
const modifiedEnvironment: StewardEnvironment = cloneDeep(baseEnvLocal);
modifiedEnvironment.production = baseEnvProd.production;
modifiedEnvironment.stewardApiUrl = baseEnvProd.stewardApiUrl;
modifiedEnvironment.stewardUiStagingUrl = baseEnvProd.stewardUiStagingUrl;
modifiedEnvironment.stewardApiStagingUrl = baseEnvProd.stewardApiStagingUrl;
modifiedEnvironment.azureAppId = baseEnvProd.azureAppId;
modifiedEnvironment.azureAppScope = baseEnvProd.azureAppScope;
modifiedEnvironment.salusUrl = baseEnvProd.salusUrl;

export const environment = modifiedEnvironment;
