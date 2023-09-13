import { LogTopic } from './log-topic';
import { ILogger } from './logger';

/** Applies a set list of topics to many logs. */
export class TopicLogger {
  constructor(private readonly service: ILogger, private readonly topics: LogTopic[]) {}

  /** Proxy for console.log */
  public log(...data: unknown[]): void {
    this.service.log(this.topics, ...data);
  }

  /** Proxy for console.warn */
  public warn(...data: unknown[]): void {
    this.service.warn(this.topics, ...data);
  }

  /** Proxy for console.error */
  public error(error: Error, ...data: unknown[]): void {
    this.service.error(this.topics, error, ...data);
  }

  /** Proxy for console.debug */
  public debug(...data: unknown[]): void {
    this.service.debug(this.topics, ...data);
  }
}
