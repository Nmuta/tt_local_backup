/** Interface for a background job. */
export interface BackgroundJob<T> {
  jobId: string;
  status: string;
  result: string;
  parsedResult: T;
}

export enum BackgroundJobStatus {
  Completed = 'Completed',
  InProgress  = 'InProgress',
  Failed  = 'Failed',
}
