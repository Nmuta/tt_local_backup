import BigNumber from 'bignumber.js';
import { DateTime, Duration } from 'luxon';
import { DataActivityCreationBehavior } from './data-activity-creation-behavior';
import { KustoFunction } from './kusto-function';

/** A kusto-type data activity. */
export interface ObligationKustoDataActivity {
  activityName: string;
  kustoTableName: string;
  kustoFunction: KustoFunction;
  destinationDatabase: string;
  startDateUtc: DateTime;
  endDateUtc: DateTime;
  maxExecutionSpan: Duration | string;
  executionInterval: Duration | string;
  executionDelay: Duration | string;
  isTimeAgnostic: boolean;
  dataActivityDependencyNames: string[];
  selfDependency: boolean;
  parallelismLimit: BigNumber;
  creationBehavior: DataActivityCreationBehavior;
}
