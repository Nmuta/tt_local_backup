import BigNumber from 'bignumber.js';
import moment from 'moment';
import { KustoFunction } from './kusto-function';

export interface ObligationDataActivity {
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
