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
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ['html', 'cobertura', 'text', 'lcov'],
      fixWebpackSourcePaths: true,
      thresholds: {
        global: {
          statements: 60,
          lines: 60,
          functions: 60,
        },
        // each: {
        //   statements: 20,
        //   lines: 20,
        //   functions: 20,
        // },
      },
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['HeadlessChrome'],
    customLaunchers: {
      HeadlessChrome: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: false,
  });
};
