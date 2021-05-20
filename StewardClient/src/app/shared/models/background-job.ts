/** Interface for a background job. */
export interface BackgroundJob<T> {
  createdDateUtc: Date;
  jobId: string;
  status: BackgroundJobStatus;
  rawResult: Record<string, unknown>;
  result: T;
  isRead: boolean;
  reason: string;
  /** Client-side-only value. True while a "marking read" request is in flight. */
  isMarkingRead: boolean;
}

export enum BackgroundJobStatus {
  Completed = 'Completed',
  CompletedWithErrors = 'CompletedWithErrors',
  InProgress = 'InProgress',
  Failed = 'Failed',
}
