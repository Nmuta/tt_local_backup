import BigNumber from 'bignumber.js';
import { DateTime, Duration } from 'luxon';
import { DataActivityCreationBehavior } from './data-activity-creation-behavior';
import { KustoFunction } from './kusto-function';

/** A kusto-type restate-o-matic data activity. */
export interface ObligationKustoRestateOMaticDataActivity {
  activityName: string;
  kustoTableName: string;
  kustoDatabase: string;
  kustoFunction: KustoFunction;
  destinationDatabase: string;
  startDateUtc: DateTime;
  endDateUtc: DateTime;
  maxExecutionSpan: Duration;
  executionInterval: Duration;
  executionDelay: Duration;
  dataActivityDependencyNames: string[];
  parallelismLimit: BigNumber;
  targetDataActivity: string;
  includeChildren: boolean;
  creationBehavior: DataActivityCreationBehavior;
}
