import BigNumber from 'bignumber.js';
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
  maxExecutionSpan: moment.Duration;
  executionInterval: moment.Duration;
  executionDelay: moment.Duration;
  dataActivityDependencyNames: string[];
  parallelismLimit: BigNumber;
  targetDataActivity: string;
  includeChildren: boolean;
}
