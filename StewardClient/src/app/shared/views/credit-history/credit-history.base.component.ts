import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { WoodstockCreditDetailsEntry } from '@models/woodstock';
import { NEVER, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { IdentityResultUnion } from '@models/identity-query.model';
import { GameTitleCodeName } from '@models/enums';
import BigNumber from 'bignumber.js';
import { SunriseCreditDetailsEntry } from '@models/sunrise';

export type CreditDetailsEntryUnion = SunriseCreditDetailsEntry | WoodstockCreditDetailsEntry;
/** Retreives and displays a player's credit history by XUID. */
@Component({
  template: '',
})
export abstract class CreditHistoryBaseComponent<T extends CreditDetailsEntryUnion>
  extends BaseComponent
  implements OnInit, OnChanges {
  @Input() public identity?: IdentityResultUnion;

  /** A list of player credit events. */
  public creditHistory: T[];

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

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getCreditUpdates$
      .pipe(
        takeUntil(this.onDestroy$),
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
    this.creditHistory = [];
    this.getCreditUpdates$.next();
  }

  /** Load more credit updates */
  public loadMoreCreditUpdates(): void {
    this.getCreditUpdates$.next();
  }
}
