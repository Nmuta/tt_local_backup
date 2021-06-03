import BigNumber from 'bignumber.js';
import { Duration } from 'luxon';
import { KustoFunction } from './kusto-function';

/** A kusto-type restate-o-matic data activity. */
export interface ObligationKustoRestateOMaticDataActivity {
  activityName: string;
  kustoTableName: string;
  kustoDatabase: string;
  kustoFunction: KustoFunction;
  destinationDatabase: string;
  startDateUtc: Date;
  endDateUtc: Date;
  maxExecutionSpan: Duration;
  executionInterval: Duration;
  executionDelay: Duration;
  dataActivityDependencyNames: string[];
  parallelismLimit: BigNumber;
  targetDataActivity: string;
  includeChildren: boolean;
}
