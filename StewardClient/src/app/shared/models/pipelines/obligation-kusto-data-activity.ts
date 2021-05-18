import BigNumber from 'bignumber.js';
import moment from 'moment';
import { KustoFunction } from './kusto-function';

/** A kusto-type data activity. */
export interface ObligationKustoDataActivity {
  activityName: string;
  kustoTableName: string;
  kustoFunction: KustoFunction;
  destinationDatabase: string;
  startDateUtc: Date;
  endDateUtc: Date;
  maxExecutionSpan: moment.Duration;
  executionInterval: moment.Duration;
  executionDelay: moment.Duration;
  dataActivityDependencyNames: string[];
  parallelismLimit: BigNumber;
}
