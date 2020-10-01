import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { createMockApplicationInsights } from '@mocks/application-insights.mock';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        createMockApplicationInsights(),
      ]});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use correct environment values', () => {
    expect(service).toBeTruthy();
    expect(service.appInsightsLevel).toBe(environment.loggerConfig.appInsightsLogLevel);
    expect(service.consoleLevel).toBe(environment.loggerConfig.consoleLogLevel);
  });
});
