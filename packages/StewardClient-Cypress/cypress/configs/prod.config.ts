import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,

  env: {
    STEWARD_API: 'https://steward-api-prod.azurewebsites.net',
    TEST_WOODSTOCK: false,
    TEST_STEELHEAD: false,
    AAD_APP_ENV: 'PROD',
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
      mochaFile: 'reports/mocha-junit/prod/junit-[hash].xml',
      toConsole: true,
      attachments: true,
    },
  },

  e2e: {
    experimentalRunAllSpecs: true,
    baseUrl: 'https://steward-ui-prod.azurewebsites.net',
    specPattern: 'cypress/e2e/**/*.spec.*',
    supportFile: 'cypress/support/commands.ts',
    testIsolation: false,
  },
});
