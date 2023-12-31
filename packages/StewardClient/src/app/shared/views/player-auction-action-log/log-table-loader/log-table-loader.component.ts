import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionDetailsLinkGenerator } from '@helpers/link-generators';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerAuctionAction } from '@models/player-auction-action';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { last } from 'lodash';
import { DateTime } from 'luxon';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LogTableServiceContract } from '../log-table/log-table.component';

/** Contract required for a service usable with {@link LogTableLoaderComponent}. */
export interface AuctionActionLogTableServiceContract extends LogTableServiceContract {
  /** Gets a player's auction action log by xuid.  */
  getPlayerAuctionLogByXuid$(
    xuid: BigNumber,
    skipToken?: DateTime,
  ): Observable<PlayerAuctionAction[]>;
}

/** Retrieves auction log data using the given service, and renders the results. */
@Component({
  selector: 'log-table-loader',
  templateUrl: './log-table-loader.component.html',
  styleUrls: ['./log-table-loader.component.scss'],
})
export class LogTableLoaderComponent extends BaseComponent implements OnInit {
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  /** REVIEW-COMMENT: The auction log-table service. */
  @Input() public service: AuctionActionLogTableServiceContract;
  /** REVIEW-COMMENT: Auction link generator. */
  @Input() public linkGenerator: AuctionDetailsLinkGenerator;

  public getMonitor = new ActionMonitor('GET Auction Action Logs');
  public auctionLog: PlayerAuctionAction[] = [];
  public mayHaveMoreItems: boolean = true;

  /** True only when it's possible to load more items. */
  public get canLoadMore(): boolean {
    return !this.getMonitor.isActive && this.mayHaveMoreItems;
  }

  private skipToken: DateTime = undefined;

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.service
      .getPlayerAuctionLogByXuid$(this.identity.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(auctionLog => {
        this.auctionLog = auctionLog;
        // relies on ordering to select skip token
        this.mayHaveMoreItems = auctionLog.length > 0;
        this.skipToken = last(auctionLog)?.timeUtc;
      });
  }

  /** Fired when the user requests more items to be loaded. */
  public loadMore(): void {
    if (this.getMonitor.isActive) {
      return;
    }
    if (!this.mayHaveMoreItems) {
      return;
    }

    this.getMonitor = this.getMonitor.repeat();

    this.service
      .getPlayerAuctionLogByXuid$(this.identity.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(auctionLog => {
        this.auctionLog = [...this.auctionLog, ...auctionLog];
        // relies on ordering to select skip token
        this.mayHaveMoreItems = auctionLog.length > 0;
        this.skipToken = last(auctionLog)?.timeUtc;
      });
  }

  /** Fired when the user requests more items to be loaded. */
  public loadRest(): void {
    if (!this.getMonitor.isDone) {
      return;
    }
    if (!this.mayHaveMoreItems) {
      return;
    }

    this.getMonitor = this.getMonitor.repeat();

    const tryLoadingMore$ = new Subject<void>();
    tryLoadingMore$
      .pipe(
        this.getMonitor.monitorStart(),
        switchMap(() =>
          this.service.getPlayerAuctionLogByXuid$(this.identity.xuid, this.skipToken),
        ),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe({
        next: auctionLog => {
          this.auctionLog = [...this.auctionLog, ...auctionLog];
          // relies on ordering to select skip token
          this.mayHaveMoreItems = auctionLog.length > 0;
          this.skipToken = last(auctionLog)?.timeUtc;

          if (this.mayHaveMoreItems) {
            tryLoadingMore$.next();
          } else {
            tryLoadingMore$.complete();
          }
        },
      });

    tryLoadingMore$.next();
  }
}
