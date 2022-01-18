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
import { clamp, slice } from 'lodash';

export type CreditDetailsEntryUnion = SunriseCreditDetailsEntry | WoodstockCreditDetailsEntry;
export type CreditDetailsEntryMixin = {
  timeMatchesAbove?: boolean;
  timeMatchesBelow?: boolean;
  xpTrend?: 'higher' | 'lower' | 'equal' | 'unknown';
  xpDifference?: BigNumber;
};

/** Applies analysis for timeMatchesAbove and timeMatchesBelow */
function applyGroupingAnalysis(
  startAtIndex: number,
  data: (CreditDetailsEntryUnion & CreditDetailsEntryMixin)[],
): void {
  for (let i = Math.max(0, startAtIndex - 1); i < data.length - 1; i++) {
    const prev = i - 1;
    const next = i + 1;
    const currentDate = data[i].eventTimestampUtc;

    const prevIsSame = prev < 0 ? false : +data[prev].eventTimestampUtc == +currentDate;
    const nextIsSame = +data[next].eventTimestampUtc == +currentDate;
    data[i].timeMatchesAbove = prevIsSame;
    data[i].timeMatchesBelow = nextIsSame;
  }
}

/** Finds the start of a group produced by @see {applyGroupingAnalysis}, given an initial index. */
function findGroupStart(
  fromIndex: number,
  data: (CreditDetailsEntryUnion & CreditDetailsEntryMixin)[],
): number {
  if (fromIndex < 0 || fromIndex >= data.length) {
    return clamp(fromIndex, 0, data.length - 1);
  }

  let index = fromIndex;
  while (index >= 0 && data[index].timeMatchesAbove) {
    index--;
  }
  return index;
}

/** Finds the end of a group produced by @see {applyGroupingAnalysis}, given an initial index. */
function findGroupEnd(
  fromIndex: number,
  data: (CreditDetailsEntryUnion & CreditDetailsEntryMixin)[],
): number {
  if (fromIndex < 0 || fromIndex >= data.length) {
    return clamp(fromIndex, 0, data.length - 1);
  }

  let index = fromIndex;
  while (index < data.length && data[index].timeMatchesBelow) {
    index++;
  }
  return index;
}

/** Applies analysis for xpDifference */
function applyXpAnalysis(
  startAtIndex: number,
  data: (CreditDetailsEntryUnion & CreditDetailsEntryMixin)[],
): void {
  // must start from the second group
  if (startAtIndex == 0) {
    startAtIndex = findGroupEnd(startAtIndex, data) + 1;
  }

  let groupStart = findGroupStart(startAtIndex, data);
  let previousGroupEnd = groupStart - 1;
  let previousGroupStart = findGroupStart(previousGroupEnd - 1, data);
  let previousGroup = slice(data, previousGroupStart, previousGroupEnd + 1).map(v => v.totalXp);
  let previousGroupMax = BigNumber.max(...previousGroup);
  while (groupStart < data.length) {
    let groupEnd = findGroupEnd(groupStart, data);
    const group = slice(data, groupStart, groupEnd + 1).map(v => v.totalXp);
    const groupMin = BigNumber.min(...group);
    const diff = groupMin.minus(previousGroupMax);
    data[groupStart].xpDifference = diff;

    // default to unknown for entire range
    for (let i = groupStart; i <= groupEnd; i++) {
      data[i].xpTrend = 'unknown';
    }

    // first entry in the range gets flagged
    if (diff.isEqualTo(0)) {
      data[groupStart].xpTrend = 'equal';
    } else if (diff.isLessThan(0)) {
      data[groupStart].xpTrend = 'lower';
    } else if (diff.isGreaterThan(0)) {
      data[groupStart].xpTrend = 'higher';
    }

    previousGroupStart = groupStart;
    previousGroupEnd = groupEnd;
    previousGroup = group;
    previousGroupMax = BigNumber.max(...group);
    groupStart = groupEnd + 1;
    groupEnd = null;
  }
}

/** Retreives and displays a player's credit history by XUID. */
@Component({
  template: '',
})
export abstract class CreditHistoryBaseComponent<T extends CreditDetailsEntryUnion>
  extends BaseComponent
  implements OnInit, OnChanges
{
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

  public xpAnalysisDates: (CreditDetailsEntryUnion & CreditDetailsEntryMixin)[] = null;

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
        applyGroupingAnalysis(priorLength, this.creditHistory.data);
        applyXpAnalysis(priorLength, this.creditHistory.data);

        const xpAnalysisBadDates = this.creditHistory.data.filter(e => e.xpTrend === 'lower');
        this.xpAnalysisDates = xpAnalysisBadDates.length > 0 ? xpAnalysisBadDates : null;

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
