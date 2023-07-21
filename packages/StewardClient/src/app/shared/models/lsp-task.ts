import { DateTime } from 'luxon';
import { GuidLikeString } from './extended-types';
import BigNumber from 'bignumber.js';

export enum LspTaskState {
  Pending = 'Pending',
  Processing = 'Processing',
  Complete = 'Complete',
  Failed = 'Failed',
  Disabled = 'Disabled',
}

export enum LspTaskPeriodType {
  None = 'None',
  Deterministic = 'Deterministic',
  NonDeterministic = 'NonDeterministic',
}

/** Interface for a an lsp task. */
export interface LspTask {
  customProperties: string;
  executorType: string;
  id: GuidLikeString;
  lastEventUtc: DateTime;
  lastException: string;
  lastRunDuration: BigNumber;
  lock: GuidLikeString;
  lockTakenUntilUtc: DateTime;
  nextExecutionUtc: DateTime;
  periodInSeconds: BigNumber;
  periodType: LspTaskPeriodType;
  state: LspTaskState;
}
