import { DateTime } from 'luxon';
import { GuidLikeString } from './extended-types';

/** Interface for a background job. */
export interface BackgroundJob<T> {
  createdDateUtc: DateTime;
  jobId: string;
  status: BackgroundJobStatus;
  rawResult: Record<string, unknown>;
  result: T;
  isRead: boolean;
  reason: string;
  userId: GuidLikeString;
  /** Client-side-only value. True while a "marking read" request is in flight. */
  isMarkingRead: boolean;
}

/** Status of a background job */
export enum BackgroundJobStatus {
  Completed = 'Completed',
  CompletedWithErrors = 'CompletedWithErrors',
  InProgress = 'InProgress',
  Failed = 'Failed',
}

/** Reason why the application retries to query the status of a background job */
export enum BackgroundJobRetryStatus {
  InProgress = 'Still in progress',
  UnexpectedError = 'Background job failed unexpectedly.',
}
