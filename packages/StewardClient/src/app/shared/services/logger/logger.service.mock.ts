import { Injectable, Provider } from '@angular/core';

import { LogLevel } from './log-level';
import { LogTopic } from './log-topic';
import { LoggerService } from './logger.service';

/** Defines the mock for the Topic Logger produced by Logger Service. */
export class MockTopicLogger {
  public log: (...data: unknown[]) => void = jasmine.createSpy('log');
  public warn: (...data: unknown[]) => void = jasmine.createSpy('warn');
  public debug: (...data: unknown[]) => void = jasmine.createSpy('debug');
  public debugger: (...data: unknown[]) => void = jasmine.createSpy('debugger');
}

/** Defines the mock for the Logger Service. */
@Injectable()
export class MockLoggerService {
  public consoleLevel: LogLevel = LogLevel.Everything;
  public appInsightsLevel: LogLevel = LogLevel.Everything;
  public log: (topics: LogTopic[], ...data: unknown[]) => void = jasmine.createSpy('log');
  public warn: (topics: LogTopic[], ...data: unknown[]) => void = jasmine.createSpy('warn');
  public debug: (topics: LogTopic[], ...data: unknown[]) => void = jasmine.createSpy('debug');
  public debugger: (topics: LogTopic[], ...data: unknown[]) => void = jasmine.createSpy('debugger');
  /** makes a mock topic logger. */
  public makeTopicLogger(_topics: LogTopic[]): MockTopicLogger {
    return new MockTopicLogger();
  }
}

/** Creates an injectable mock for Logger Service. */
export function createMockLoggerService(): Provider {
  return { provide: LoggerService, useValue: new MockLoggerService() };
}
