/** Interface for a background job. */
export interface BackgroundJob<T> {
  jobId: string;
  status: string;
  rawResult: Record<string, unknown>;
  result: T;
}

export enum BackgroundJobStatus {
  Completed = 'Completed',
  InProgress = 'InProgress',
  Failed = 'Failed',
}
