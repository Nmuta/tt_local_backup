import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { ApolloBanResult } from '@models/apollo';
import {
  BackgroundJob,
  BackgroundJobRetryStatus,
  BackgroundJobStatus,
} from '@models/background-job';
import { SunriseBanResult } from '@models/sunrise';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, of, throwError, timer } from 'rxjs';
import { delayWhen, retryWhen, switchMap, take, takeUntil, tap } from 'rxjs/operators';

export type BanResultsUnion = SunriseBanResult | ApolloBanResult;

/** User banning base component. */
@Component({
  template: '',
})
export class UserBanningBaseComponent extends BaseComponent {
  /** True while waiting on a request. */
  public banResults: BanResultsUnion[];
  /** The ban action monitor. */
  public banActionMonitor = new ActionMonitor('Ban players');

  constructor(private readonly backgroundJobService: BackgroundJobService) {
    super();
  }

  /** Waits for a background job to complete. */
  public waitForBackgroundJobToComplete$(
    job: BackgroundJob<void>,
  ): Observable<void | BackgroundJob<BanResultsUnion[]>> {
    return this.backgroundJobService.getBackgroundJob$<BanResultsUnion[]>(job.jobId).pipe(
      take(1),
      tap(job => {
        switch (job.status) {
          case BackgroundJobStatus.Completed:
          case BackgroundJobStatus.CompletedWithErrors:
            const result = job.result;
            this.banResults = Array.isArray(result) ? result : [result];
            break;
          case BackgroundJobStatus.InProgress:
            throw new Error(BackgroundJobRetryStatus.InProgress);
          default:
            throw new Error(BackgroundJobRetryStatus.UnexpectedError);
        }
      }),
      retryWhen(errors$ =>
        errors$.pipe(
          switchMap((error: Error) => {
            if (error.message !== BackgroundJobRetryStatus.InProgress) {
              return throwError(() => error);
            }

            return of(error);
          }),
          delayWhen(() => timer(HCI.AutoRetryMillis)),
        ),
      ),
      takeUntil(this.onDestroy$),
    );
  }

  /** Clears the gift basket state by reinitializing component variables. */
  public resetBanningToolUI(): void {
    this.banResults = undefined;
    this.banActionMonitor = this.banActionMonitor.repeat();
  }
}
