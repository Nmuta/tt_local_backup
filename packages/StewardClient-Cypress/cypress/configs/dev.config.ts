import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    STEWARD_API: 'https://steward-api-dev.azurewebsites.net',
    TEST_WOODSTOCK: true,
    TEST_STEELHEAD: true,
    AAD_APP_ENV: 'DEV',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  video: false,
  screenshotOnRunFailure: false,
  viewportWidth: 1920,
  viewportHeight: 1080,

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, mocha-junit-reporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'reports/mocha-junit/dev/junit-[hash].xml',
      toConsole: true,
      attachments: true,
    },
  },

  e2e: {
    experimentalRunAllSpecs: true,
    testIsolation: false,
    baseUrl: 'https://steward-ui-dev.azurewebsites.net',
    specPattern: 'cypress/e2e/**/*.spec.*',
    supportFile: 'cypress/support/commands.ts',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/grep/src/plugin')(config);
      return config;
    }
  },
});
