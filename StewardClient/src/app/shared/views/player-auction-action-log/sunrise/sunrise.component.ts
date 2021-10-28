import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerAuctionAction } from '@models/player-auction-action';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { last } from 'lodash';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

/** Displays auction action log for the given Sunrise player. */
@Component({
  selector: 'sunrise-player-auction-action-log',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunrisePlayerAuctionActionLogComponent extends BaseComponent implements OnInit {
  @Input() public identity: IdentityResultAlpha;

  public getMonitor = new ActionMonitor('GET Auction Action Logs');
  public auctionLog: PlayerAuctionAction[] = [];
  public mayHaveMoreItems: boolean = true;

  /** True only when it's possible to load more items. */
  public get canLoadMore(): boolean {
    return !this.getMonitor.isActive && this.mayHaveMoreItems;
  }

  private skipToken: DateTime = undefined;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.sunrise
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

    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);

    this.sunrise
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

    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);

    const tryLoadingMore$ = new Subject<void>();
    tryLoadingMore$
      .pipe(
        this.getMonitor.monitorStart(),
        switchMap(() =>
          this.sunrise.getPlayerAuctionLogByXuid$(this.identity.xuid, this.skipToken),
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
