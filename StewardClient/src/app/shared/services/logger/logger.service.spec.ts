import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { createMockApplicationInsights } from '@mocks/application-insights.mock';
import { MockConsole } from '@mocks/console.mock';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let mockConsole: MockConsole;
  let mockAppInsights: ApplicationInsights;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [createMockApplicationInsights()],
    });
    service = TestBed.inject(LoggerService);
    mockAppInsights = TestBed.inject(ApplicationInsights);
    mockConsole = new MockConsole();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).console = mockConsole;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use correct environment values', () => {
    expect(service).toBeTruthy();
    expect(service.appInsightsLevel).toBe(
      environment.loggerConfig.appInsightsLogLevel,
    );
    expect(service.consoleLevel).toBe(environment.loggerConfig.consoleLogLevel);
  });

  it('should log', () => {
    service.log([], 'test');
    expect(mockConsole.log).toHaveBeenCalled();
    expect(mockAppInsights.trackTrace).toHaveBeenCalled();
  });

  it('should warn', () => {
    service.warn([], 'test');
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockAppInsights.trackTrace).toHaveBeenCalled();
  });

  it('should debug', () => {
    service.debug([], 'test');
    expect(mockConsole.debug).toHaveBeenCalled();
    expect(mockAppInsights.trackTrace).toHaveBeenCalled();
  });
});
