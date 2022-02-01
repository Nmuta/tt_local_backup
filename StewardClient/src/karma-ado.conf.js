// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: '',
    browserNoActivityTimeout: 20000,
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-nightmare'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        random: false,
        verboseDeprecations: false,
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      // see https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'cobertura' },
        { type: 'lcov' },
      ],
      check: {
        global: {
          statements: 60,
          lines: 60,
          functions: 60,
          excludes: [
            '**/*.spec.ts',
            '**/app/shared/interceptors/fake-api/**/*.ts',
            '**/app/pages/util/**/*',
          ],
        },
        each: {
          statements: 20,
          lines: 20,
          functions: 20,
          excludes: [
            '**/*.spec.ts',
            '**/app/shared/interceptors/fake-api/**/*.ts',
            '**/app/pages/tools/pages/kusto-management/**/*.ts', // Kusto management is a Live Ops Admin only tool that is a MVP
            '**/app/pages/tools/pages/obligation/**/*.ts', // Data piplelines has intensive form controls, use e2e test
            '**/four-oh-four/**/*.ts',
            '**/app/shared/state/utilities/**/*.ts', // Ugly logic to test, use e2e testing
            '**/environments/**/*.ts', // Configuration
            '**/app/pages/util/**/*',
          ],
        },
      },
    },
    reporters: ['progress', 'junit', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['HeadlessChrome'],
    customLaunchers: {
      HeadlessChrome: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: true,
  });
};
