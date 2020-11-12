import { Injectable, Provider } from '@angular/core';

import { LogLevel } from './log-level';
import { LogTopic } from './log-topic';
import { LoggerService } from './logger.service';

/** Defines the mock for the Logger Service. */
@Injectable()
export class MockLoggerService {
  public consoleLevel: LogLevel = LogLevel.Everything;
  public appInsightsLevel: LogLevel = LogLevel.Everything;
  public log: (topics: LogTopic[], ...data: unknown[]) => void = jasmine.createSpy(
    'log'
  );
  public warn: (topics: LogTopic[], ...data: unknown[]) => void = jasmine.createSpy(
    'warn'
  );
  public debug: (
    topics: LogTopic[],
    ...data: unknown[]
  ) => void = jasmine.createSpy('debug');
  public debugger: (
    topics: LogTopic[],
    ...data: unknown[]
  ) => void = jasmine.createSpy('debugger');
}

export function createMockLoggerService(): Provider {
  return { provide: LoggerService, useValue: new MockLoggerService() };
}
