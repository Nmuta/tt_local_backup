import { LogTopic } from './log-topic';

export interface ILogger {
  /** Proxy for console.log */
  log(topics: LogTopic[], ...data: unknown[]): void;

  /** Proxy for console.warn */
  warn(topics: LogTopic[], ...data: unknown[]): void;

  /** Proxy for console.error */
  error(topics: LogTopic[], error: Error, ...data: unknown[]): void;

  /** Proxy for console.debug */
  debug(topics: LogTopic[], ...data: unknown[]): void;
}