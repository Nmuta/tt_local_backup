import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { ApolloBanResult } from '@models/apollo';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { SunriseBanResult } from '@models/sunrise';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { EMPTY, timer } from 'rxjs';
import { catchError, delayWhen, retryWhen, take, takeUntil, tap } from 'rxjs/operators';

export type BanResultsUnion = SunriseBanResult | ApolloBanResult;

/** User banning base component. */
@Component({
  template: '',
})
export class UserBanningBaseComponent extends BaseComponent {
  /** True while waiting on a request. */
  public banResults: BanResultsUnion[];
  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor(private readonly backgroundJobService: BackgroundJobService) {
    super();
  }

  /** Waits for a background job to complete. */
  public waitForBackgroundJobToComplete(job: BackgroundJob<void>): void {
    this.backgroundJobService
      .getBackgroundJob$<BanResultsUnion[]>(job.jobId)
      .pipe(
        catchError(_error => {
          this.loadError = _error;
          this.isLoading = false;
          return EMPTY;
        }),
        take(1),
        tap(job => {
          switch (job.status) {
            case BackgroundJobStatus.Completed:
            case BackgroundJobStatus.CompletedWithErrors:
              const result = job.result;
              this.banResults = Array.isArray(result) ? result : [result];
              break;
            case BackgroundJobStatus.InProgress:
              throw new Error('in progress');
            default:
              this.loadError = job.result || 'Background job failed unexpectedly.';
          }
          this.isLoading = false;
        }),
        retryWhen(errors$ => errors$.pipe(delayWhen(() => timer(3_000)))),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  /** Clears the gift basket state by reinitializing component variables. */
  public resetBanningToolUI(): void {
    this.banResults = undefined;
    this.loadError = undefined;
    this.isLoading = false;
  }
}
