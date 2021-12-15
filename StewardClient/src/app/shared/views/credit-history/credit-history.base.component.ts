import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { WoodstockCreditDetailsEntry } from '@models/woodstock';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { IdentityResultUnion } from '@models/identity-query.model';
import { GameTitleCodeName } from '@models/enums';
import BigNumber from 'bignumber.js';
import { SunriseCreditDetailsEntry } from '@models/sunrise';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

export type CreditDetailsEntryUnion = SunriseCreditDetailsEntry | WoodstockCreditDetailsEntry;
export type CreditDetailsEntryMixin = {
  timeMatchesAbove?: boolean;
  timeMatchesBelow?: boolean;
};

/** Retreives and displays a player's credit history by XUID. */
@Component({
  template: '',
})
export abstract class CreditHistoryBaseComponent<T extends CreditDetailsEntryUnion>
  extends BaseComponent
  implements OnInit, OnChanges {
  @Input() public identity?: IdentityResultUnion;

  /** A list of player credit events. */
  public creditHistory = new TableVirtualScrollDataSource<
    CreditDetailsEntryUnion & CreditDetailsEntryMixin
  >([]);

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

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

  public abstract gameTitle: GameTitleCodeName;
  public abstract getCreditHistoryByXuid$(
    xuid: BigNumber,
    startIndex: number,
    maxResults: number,
  ): Observable<T[]>;

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.getCreditUpdates$
      .pipe(
        switchMap(() => {
          this.loadingMore = true;
          const getCreditHistoryByXuid$ = this.getCreditHistoryByXuid$(
            this.identity.xuid,
            this.startIndex,
            this.maxResultsPerRequest,
          );
          return getCreditHistoryByXuid$.pipe(
            catchError(error => {
              this.loadingMore = false;
              this.isLoading = false;
              this.loadError = error;
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((creditUpdates: T[]) => {
        this.loadingMore = false;
        this.isLoading = false;
        const priorLength = this.creditHistory.data.length;
        this.creditHistory.data = this.creditHistory.data.concat(creditUpdates);
        for (let i = Math.max(0, priorLength - 1); i < this.creditHistory.data.length - 1; i++) {
          const prev = i - 1;
          const next = i + 1;
          const currentDate = this.creditHistory.data[i].eventTimestampUtc;

          const prevIsSame =
            prev < 0 ? false : +this.creditHistory.data[prev].eventTimestampUtc == +currentDate;
          const nextIsSame = +this.creditHistory.data[next].eventTimestampUtc == +currentDate;
          this.creditHistory.data[i].timeMatchesAbove = prevIsSame;
          this.creditHistory.data[i].timeMatchesBelow = nextIsSame;
        }

        this.startIndex = this.creditHistory.data.length;
        this.showLoadMore = creditUpdates.length >= this.maxResultsPerRequest;
      });

    if (!!this.identity?.xuid) {
      this.getCreditUpdates$.next();
    }
  }

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity || !this.identity?.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.startIndex = 0;
    this.creditHistory.data = [];
    this.getCreditUpdates$.next();
  }

  /** Load more credit updates */
  public loadMoreCreditUpdates(): void {
    this.getCreditUpdates$.next();
  }

  /** Type safety! */
  public data(source: unknown): T & CreditDetailsEntryMixin {
    return source as T & CreditDetailsEntryMixin;
  }
}
