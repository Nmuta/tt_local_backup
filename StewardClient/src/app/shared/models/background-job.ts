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

export enum BackgroundJobStatus {
  Completed = 'Completed',
  CompletedWithErrors = 'CompletedWithErrors',
  InProgress = 'InProgress',
  Failed = 'Failed',
}
