import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { LogLevel } from './log-level';
import { LogTopic } from './log-topic';

/* eslint-disable no-console */
/* eslint-disable no-debugger */

const logTopicsToIgnoreInConsole = [];
const logTopicsToIgnoreInAppInsights = [LogTopic.AuthInterception];

/** A logger service that acts as a configurable proxy for console.log and app insights. */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  public consoleLevel: LogLevel = LogLevel.Everything;
  public appInsightsLevel: LogLevel = LogLevel.Everything;
  public consoleTopics: LogTopic[] = Object.keys(LogTopic)
    .map(k => LogTopic[k])
    .filter(v => !logTopicsToIgnoreInConsole.includes(v));
  public appInsightsTopics: LogTopic[] = Object.keys(LogTopic)
    .map(k => LogTopic[k])
    .filter(v => !logTopicsToIgnoreInAppInsights.includes(v));

  private console = window.console;

  constructor(private readonly appInsights: ApplicationInsights) {
    this.consoleLevel = environment.loggerConfig.consoleLogLevel;
    this.appInsightsLevel = environment.loggerConfig.appInsightsLogLevel;
  }

  /** Proxy for console.log */
  public log(topics: LogTopic[], ...data: unknown[]): void {
    if (this.consoleLevel >= LogLevel.Log && this.shouldLogTopicToConsole(topics)) {
      this.console.log(`[${topics.join(',')}]`, ...data);
    }

    if (this.appInsightsLevel >= LogLevel.Log && this.shouldLogTopicToAppInsights(topics)) {
      this.trackTrace('log', topics, ...data);
    }
  }

  /** Proxy for console.warn */
  public warn(topics: LogTopic[], ...data: unknown[]): void {
    if (this.consoleLevel >= LogLevel.Warn && this.shouldLogTopicToConsole(topics)) {
      this.console.warn(`[${topics.join(',')}]`, ...data);
    }

    if (this.appInsightsLevel >= LogLevel.Warn && this.shouldLogTopicToAppInsights(topics)) {
      this.trackTrace('warn', topics, ...data);
    }
  }

  /** Proxy for console.error */
  public error(topics: LogTopic[], error: Error, ...data: unknown[]): void {
    if (this.consoleLevel >= LogLevel.Error && this.shouldLogTopicToConsole(topics)) {
      this.console.error(`[${topics.join(',')}]`, error, ...data);
    }

    if (this.appInsightsLevel >= LogLevel.Error && this.shouldLogTopicToAppInsights(topics)) {
      this.trackError('error', topics, error, ...data);
    }
  }

  /** Proxy for console.debug */
  public debug(topics: LogTopic[], ...data: unknown[]): void {
    if (this.consoleLevel >= LogLevel.Debug && this.shouldLogTopicToConsole(topics)) {
      this.console.debug(`[${topics.join(',')}]`, ...data);
    }

    if (this.appInsightsLevel >= LogLevel.Debug && this.shouldLogTopicToAppInsights(topics)) {
      this.trackTrace('debug', topics, ...data);
    }
  }

  private trackError(severity: string, topics: LogTopic[], error: unknown, ...data: unknown[]) {
    try {
      const appInsightsError = error instanceof Error ? error : new Error(JSON.stringify(error));
      const stringifiedData = data.map(d => d.toString());
      const message = `[${topics.join(' ')}]\n${stringifiedData.join('\n')}`;
      this.appInsights.trackException({
        exception: appInsightsError,
        properties: { severity: severity, message: message },
      });
    } catch (e) {
      try {
        // fallback to logging the error here and suppress the failure.
        console.error(e);
        this.appInsights.trackException({ error: e });
      } catch (e2) {
        // fallback to console-only log, or suppress
        try {
          console.error(e2);
        } catch {
          // suppress
        }
      }
    }
  }

  private trackTrace(severity: string, topics: LogTopic[], ...data: unknown[]) {
    try {
      const stringifiedData = data.map(d => d.toString());
      const message = `[${topics.join(' ')}]\n${stringifiedData.join('\n')}`;
      this.appInsights.trackTrace({ message: message }, { severity: severity });
    } catch (e) {
      try {
        // fallback to logging the error here and suppress the failure.
        console.error(e);
        this.appInsights.trackException({ error: e });
      } catch (e2) {
        // fallback to console-only log, or suppress
        try {
          console.error(e2);
        } catch {
          // suppress
        }
      }
    }
  }

  private shouldLogTopicToConsole(topics: LogTopic[]): boolean {
    if (!topics || topics.length == 0) {
      return true;
    }
    return topics.some(t => this.consoleTopics.includes(t));
  }

  private shouldLogTopicToAppInsights(topics: LogTopic[]): boolean {
    if (!topics || topics.length == 0) {
      return true;
    }
    return topics.some(t => this.appInsightsTopics.includes(t));
  }
}
