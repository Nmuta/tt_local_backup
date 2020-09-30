import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { LogLevel } from './log-level';
import { LogTopic } from './log-topic';

// tslint:disable: no-console
// tslint:disable: no-debugger

/** A logger service that acts as a configurable proxy for console.log and app insights. */
@Injectable({providedIn: 'root'})
export class LoggerService {
  public consoleLevel: LogLevel = LogLevel.Everything;
  private readonly appInsights: ApplicationInsights;

  constructor() {
    this.appInsights = new ApplicationInsights({
      config: environment.appInsightsConfig,
    });

    this.appInsights.loadAppInsights();
  }

  /** Proxy for console.log */
  public log(topics: LogTopic[], ...data: any[]): void {
    if (this.consoleLevel >= LogLevel.Log) {
      console.log(...topics, ...data);
    }
  }

  /** Proxy for console.warn */
  public warn(topics: LogTopic[], ...data: any[]): void {
    if (this.consoleLevel >= LogLevel.Warn) {
      console.warn(...topics, ...data);
    }
  }

  /** Proxy for console.debug */
  public debug(topics: LogTopic[], ...data: any[]): void {
    if (this.consoleLevel >= LogLevel.Debug) {
      console.debug(...topics, ...data);
    }
  }

  /** Proxy for console.log */
  public debugger(topics: LogTopic[]): void {
    if (this.consoleLevel >= LogLevel.Debugger) {
      debugger;
    }
  }
}
