import { Component } from '@angular/core';
import { LoggerService, LogTopic } from '@services/logger';
import BigNumber from 'bignumber.js';

/** A routed component for demonstrating logging. */
@Component({
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss'],
})
export class LoggingComponent {
  public readonly exampleObject: object = {
    one: 'one',
    two: 2,
    three: new BigNumber(3),
    four: { five: 'five' },
    six: ['seven', 8, new BigNumber(9), { ten: 'ten' }],
  };

  public readonly exampleArray = [
    'one',
    2,
    new BigNumber(3),
    ['four', 5, new BigNumber(6), { seven: 'seven', eight: 8, nine: new BigNumber(9) }],
  ];

  public readonly exampleString = 'I am a string';

  constructor(private readonly logger: LoggerService) {}

  /** Fired when "Log" button is pressed. */
  public onEmitLog(...data: unknown[]): void {
    this.logger.log([LogTopic.Test], ...data);
  }

  /** Fired when "Error" button is pressed. */
  public onEmitError(...data: unknown[]): void {
    this.logger.error([LogTopic.Test], new Error('Test Error'), ...data);
  }

  /** Fired when "Warn" button is pressed. */
  public onEmitWarn(...data: unknown[]): void {
    this.logger.warn([LogTopic.Test], ...data);
  }
}
