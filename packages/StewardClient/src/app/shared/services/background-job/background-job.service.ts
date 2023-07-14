import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BackgroundJob,
  BackgroundJobRetryStatus,
  BackgroundJobStatus,
} from '@models/background-job';
import { ApiService } from '@shared/services/api';
import { Duration } from 'luxon';
import { Observable, of, delayWhen, map, switchMap, throwError, timer } from 'rxjs';
import { retryWhen, tap } from 'rxjs/operators';

/** Defines the User Service. */
@Injectable({
  providedIn: 'root',
})
export class BackgroundJobService {
  public basePath: string = 'v1/jobs';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the background job. */
  public makeFakeBackgroundJob$<T>(
    delayInMilliseconds: number,
    status: BackgroundJobStatus,
    response: T,
  ): Observable<BackgroundJob<T>> {
    switch (status) {
      case BackgroundJobStatus.Failed:
        return this.apiService.postRequest$<BackgroundJob<T>>(
          `${this.basePath}/fake/failure/${delayInMilliseconds}`,
          response,
        );
      case BackgroundJobStatus.InProgress:
        return this.apiService.postRequest$<BackgroundJob<T>>(
          `${this.basePath}/fake/in-progress/${delayInMilliseconds}`,
          response,
        );
      case BackgroundJobStatus.Completed:
        return this.apiService.postRequest$<BackgroundJob<T>>(
          `${this.basePath}/fake/success/${delayInMilliseconds}`,
          response,
        );
      default:
        throw new Error(`Invalid status ${status}`);
    }
  }

  /** Gets the background job. */
  public getBackgroundJob$<T>(jobId: string): Observable<BackgroundJob<T>> {
    return this.apiService.getRequest$<BackgroundJob<T>>(`${this.basePath}/jobId(${jobId})`).pipe(
      tap(job => {
        try {
          job.result = job.rawResult as unknown as T;
        } catch (err) {
          /** Do nothing, just try to parse */
        }
      }),
    );
  }

  /** Gets the in progress background jobs.. */
  public getInProgressBackgroundJob$(): Observable<BackgroundJob<unknown>[]> {
    return this.apiService.getRequest$<BackgroundJob<unknown>[]>(`${this.basePath}/inProgress`);
  }

  /** Gets the background job. */
  public getBackgroundJobs$(
    userObjectId: string,
    resultsFrom: Duration,
  ): Observable<BackgroundJob<unknown>[]> {
    const params = new HttpParams().append('resultsFrom', resultsFrom.toISO());
    return this.apiService
      .getRequest$<BackgroundJob<unknown>[]>(
        `${this.basePath}/userObjectId(${userObjectId})`,
        params,
      )
      .pipe(
        tap(jobs => {
          for (const job of jobs) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              job.result = job.rawResult as unknown;
            } catch (err) {
              /** Do nothing, just try to parse */
            }
          }
        }),
      );
  }

  /** Waits for a background job to complete. */
  public waitForBackgroundJobToComplete<T>(job: BackgroundJob<void>): Observable<T> {
    return this.getBackgroundJob$<T>(job.jobId).pipe(
      map(job => {
        let returnValue: T;
        switch (job.status) {
          case BackgroundJobStatus.Completed:
          case BackgroundJobStatus.CompletedWithErrors:
            returnValue = job.result;
            break;
          case BackgroundJobStatus.InProgress:
            throw new Error(BackgroundJobRetryStatus.InProgress);
          default:
            throw new Error(BackgroundJobRetryStatus.UnexpectedError);
        }

        return returnValue;
      }),
      retryWhen(errors$ =>
        errors$.pipe(
          switchMap((error: Error) => {
            if (error.message === BackgroundJobRetryStatus.UnexpectedError) {
              return throwError(error);
            }

            return of(error);
          }),
          delayWhen(() => timer(3_000)),
        ),
      ),
    );
  }
}
