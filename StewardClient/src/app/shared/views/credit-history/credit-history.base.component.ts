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
import { ProfileRollbackHistory } from '@models/profile-rollback-history.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/** Acceptable values for which direction to sort a column */
export enum SortDirection {
  Ascending = 'Asc',
  Descending = 'Desc',
}

/** Kusto columns available for credit update history */
export enum CreditUpdateColumn {
  Timestamp = 'Timestamp',
  CreditsAfter = 'CreditsAfter',
  CreditAmount = 'CreditAmount',
  SceneName = 'SceneName',
  DeviceType = 'DeviceType',
  TotalXp = 'TotalXp',
}

export type CreditDetailsEntryUnion = SunriseCreditDetailsEntry | WoodstockCreditDetailsEntry;
export type CreditDetailsEntryMixin = {
  timeMatchesAbove?: boolean;
  timeMatchesBelow?: boolean;
  xpTrend?: 'higher' | 'lower' | 'equal' | 'unknown';
  xpDifference?: BigNumber;
};

/** Applies analysis for timeMatchesAbove and timeMatchesBelow. */
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
  /** Player identity. */
  @Input() public identity?: IdentityResultUnion;

  public formControls = {
    sortOptions: new FormControl('', Validators.required),
  };

  public formGroup = new FormGroup(this.formControls);

  public getCreditUpdatesMonitor = new ActionMonitor('Get credit updates');
  public saveRollbackMonitor = new ActionMonitor('GET save rollback');

  public columnOptions = CreditUpdateColumn;
  public directionOptions = SortDirection;

  /** A list of player credit events. */
  public creditHistory = new TableVirtualScrollDataSource<
    CreditDetailsEntryUnion & CreditDetailsEntryMixin
  >([]);
  public saveRollbackHistory: ProfileRollbackHistory[];

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
  public displayTrendAnalysisDisabled: boolean;

  public xpAnalysisDates: (CreditDetailsEntryUnion & CreditDetailsEntryMixin)[] = null;

  public abstract gameTitle: GameTitleCodeName;
  public abstract isSaveRollbackSupported: boolean;
  public abstract getCreditHistoryByXuid$(
    xuid: BigNumber,
    column: CreditUpdateColumn,
    direction: SortDirection,
    startIndex: number,
    maxResults: number,
  ): Observable<T[]>;
  public abstract getSaveRollbackHistoryByXuid$(
    xuid: BigNumber,
  ): Observable<ProfileRollbackHistory[]>;

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.getCreditUpdates$
      .pipe(
        switchMap(() => {
          this.loadingMore = true;
          const getCreditHistoryByXuid$ = this.getCreditHistoryByXuid$(
            this.identity.xuid,
            this.formControls.sortOptions.value?.column,
            this.formControls.sortOptions.value?.direction,
            this.startIndex,
            this.maxResultsPerRequest,
          );
          this.getCreditUpdatesMonitor = this.getCreditUpdatesMonitor.repeat();

          return getCreditHistoryByXuid$.pipe(
            this.getCreditUpdatesMonitor.monitorSingleFire(),
            catchError(_ => {
              this.loadingMore = false;
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((creditUpdates: T[]) => {
        this.loadingMore = false;

        // Logic here differs depending on if we're loading more of previous query, or starting a new one
        const priorLength = this.startIndex > 0 ? this.creditHistory.data.length : 0;
        this.creditHistory.data =
          this.startIndex > 0
            ? this.creditHistory.data.concat(creditUpdates)
            : (this.creditHistory.data = creditUpdates);

        // Can't accurately verify if credits jumped an unreasonable amount without full history.
        if (
          this.formControls.sortOptions.value?.column == CreditUpdateColumn.Timestamp &&
          this.formControls.sortOptions.value?.direction == SortDirection.Ascending
        ) {
          applyGroupingAnalysis(priorLength, this.creditHistory.data);
          applyXpAnalysis(priorLength, this.creditHistory.data);

          this.displayTrendAnalysisDisabled = false;
          const xpAnalysisBadDates = this.creditHistory.data.filter(e => e.xpTrend === 'lower');
          this.xpAnalysisDates = xpAnalysisBadDates.length > 0 ? xpAnalysisBadDates : null;
        } else {
          this.displayTrendAnalysisDisabled = true;
          this.xpAnalysisDates = null;
        }

        this.startIndex = this.creditHistory.data.length;
        this.showLoadMore = creditUpdates.length >= this.maxResultsPerRequest;
      });

    if (!!this.identity?.xuid) {
      this.displayTrendAnalysisDisabled = true;
      this.getCreditUpdates$.next();
      this.loadSaveRollbackHistory();
    }
  }

  /** Trigger new lookup with current form selections. */
  public lookupCreditUpdates(): void {
    this.startIndex = 0;
    this.getCreditUpdates$.next();
  }

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity || !this.identity?.xuid) {
      return;
    }

    this.startIndex = 0;
    this.creditHistory.data = [];
    this.saveRollbackHistory = null;
    this.loadSaveRollbackHistory();
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

  /** Load save rollbacks history for player */
  private loadSaveRollbackHistory(): void {
    if (this.isSaveRollbackSupported) {
      this.saveRollbackMonitor = this.saveRollbackMonitor.repeat();
      const getSaveRollbackHistoryByXuid$ = this.getSaveRollbackHistoryByXuid$(this.identity.xuid);
      getSaveRollbackHistoryByXuid$
        .pipe(this.saveRollbackMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(rollbackHistory => {
          this.saveRollbackHistory = rollbackHistory.length > 0 ? rollbackHistory : null;
        });
    }
  }
}
