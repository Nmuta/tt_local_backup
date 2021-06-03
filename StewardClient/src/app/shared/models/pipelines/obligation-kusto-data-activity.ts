import BigNumber from 'bignumber.js';
import { Duration } from 'luxon';
import { KustoFunction } from './kusto-function';

/** A kusto-type data activity. */
export interface ObligationKustoDataActivity {
  activityName: string;
  kustoTableName: string;
  kustoFunction: KustoFunction;
  destinationDatabase: string;
  startDateUtc: Date;
  endDateUtc: Date;
  maxExecutionSpan: Duration;
  executionInterval: Duration;
  executionDelay: Duration;
  dataActivityDependencyNames: string[];
  parallelismLimit: BigNumber;
}
