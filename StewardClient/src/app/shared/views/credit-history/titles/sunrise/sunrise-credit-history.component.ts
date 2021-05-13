import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { SunriseCreditDetailsEntry } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { NEVER, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';

/** Retreives and displays Sunrise credit history by XUID. */
@Component({
  selector: 'sunrise-credit-history',
  templateUrl: './sunrise-credit-history.component.html',
  styleUrls: ['./sunrise-credit-history.component.scss'],
})
export class SunriseCreditHistoryComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The credit history data. */
  public creditHistory: SunriseCreditDetailsEntry[];
  public columnsToDisplay = [
    'eventTimestampUtc',
    'deviceType',
    'creditsAfter',
    'creditAmount',
    'sceneName',
    'totalXp',
  ];

  public getCreditUpdates$ = new Subject<void>();
  public startIndex = 0;
  public maxResultsPerRequest = 5000;
  public loadingMore = false;
  public showLoadMore: boolean;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getCreditUpdates$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          this.loadingMore = true;
          return this.sunrise
            .getCreditHistoryByXuid$(this.xuid, this.startIndex, this.maxResultsPerRequest)
            .pipe(
              catchError(error => {
                this.loadingMore = false;
                this.isLoading = false;
                this.loadError = error;
                return NEVER;
              }),
            );
        }),
      )
      .subscribe(creditUpdates => {
        this.loadingMore = false;
        this.isLoading = false;
        this.creditHistory = this.creditHistory.concat(creditUpdates);
        this.startIndex += this.creditHistory.length;
        this.showLoadMore = creditUpdates.length >= this.maxResultsPerRequest;
      });

    if (!!this.xuid) {
      this.getCreditUpdates$.next();
    }
  }

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.startIndex = 0;
    this.creditHistory = [];
    this.getCreditUpdates$.next();
  }

  /** Load more credit updates */
  public loadMoreCreditUpdates(): void {
    this.getCreditUpdates$.next();
  }
}
