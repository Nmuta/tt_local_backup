import { IConfig, IConfiguration } from '@microsoft/applicationinsights-web';
import { LogLevel } from '@services/logger';
import { HomeTileInfo } from './app-data/tool-list';

/** Type verification for Environment. */
export interface StewardEnvironment {
  production: boolean;
  azureAppId: string;
  azureAppScope: string;
  stewardUiUrl: string;
  stewardUiStagingUrl: string;
  stewardApiUrl: string;
  stewardApiStagingUrl: string;
  stewardBlobStorageUrl: string;
  oldScrutineerApiUrl: string;

  /** Placeholder value replaced in ADO pipeline. */
  adoVersion: string;

  /** When true, FakeAPI will be lazy-loaded at launch time. */
  enableFakeApi: boolean;

  /** Passed through when Application Insights is configured. */
  appInsightsConfig: IConfiguration & IConfig;

  /** Used to configure the (default) logging levels. */
  loggerConfig: {
    /** The maximum level of logs to send to app insights. */
    appInsightsLogLevel: LogLevel;

    /** The maximum level of logs to dump to console. */
    consoleLogLevel: LogLevel;
  };

  /** The list of tools to show in the nav and homepage */
  tools: HomeTileInfo[];
}
