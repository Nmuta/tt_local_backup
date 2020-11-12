import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { LogLevel } from './log-level';
import { LogTopic } from './log-topic';

/* eslint-disable no-console */
/* eslint-disable no-debugger */

/** A logger service that acts as a configurable proxy for console.log and app insights. */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  public consoleLevel: LogLevel = LogLevel.Everything;
  public appInsightsLevel: LogLevel = LogLevel.Everything;

  private console = window.console;

  constructor(private readonly appInsights: ApplicationInsights) {
    this.consoleLevel = environment.loggerConfig.consoleLogLevel;
    this.appInsightsLevel = environment.loggerConfig.appInsightsLogLevel;
  }

  /** Proxy for console.log */
  public log(topics: LogTopic[], ...data: unknown[]): void {
    if (this.consoleLevel >= LogLevel.Log) {
      this.console.log(...topics, ...data);
    }

    if (this.appInsightsLevel >= LogLevel.Log) {
      this.trackTrace('log', topics, ...data);
    }
  }

  /** Proxy for console.warn */
  public warn(topics: LogTopic[], ...data: unknown[]): void {
    if (this.consoleLevel >= LogLevel.Warn) {
      this.console.warn(...topics, ...data);
    }

    if (this.appInsightsLevel >= LogLevel.Warn) {
      this.trackTrace('warn', topics, ...data);
    }
  }

  /** Proxy for console.debug */
  public debug(topics: LogTopic[], ...data: unknown[]): void {
    if (this.consoleLevel >= LogLevel.Debug) {
      this.console.debug(...topics, ...data);
    }

    if (this.appInsightsLevel >= LogLevel.Debug) {
      this.trackTrace('debug', topics, ...data);
    }
  }

  private trackTrace(severity: string, topics: LogTopic[], ...data: unknown[]) {
    const message = `[${topics.join(' ')}]\n${data.join('\n')}`;
    this.appInsights.trackTrace({ message: message }, { severity: severity });
  }
}
