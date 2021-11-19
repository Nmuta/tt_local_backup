import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionData } from '@models/auction-data';
import { GameTitleAbbreviation } from '@models/enums';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { map, tap, switchMap, takeUntil } from 'rxjs/operators';

/** A component that retrieves and renders woodstock auction data from path parameters. */
@Component({
  templateUrl: './woodstock-auction.component.html',
  styleUrls: ['./woodstock-auction.component.scss'],
})
export class WoodstockAuctionComponent extends BaseComponent implements OnInit {
  public auctionId: string;
  public auctionData: AuctionData;
  public GameTitleAbbreviation = GameTitleAbbreviation;

  public getMonitor: ActionMonitor = new ActionMonitor('GET FH5 Auction Data');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly woodstock: WoodstockService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        tap(auctionId => (this.auctionId = auctionId)),
        this.getMonitor.monitorStart(),
        switchMap(auctionId =>
          this.woodstock.getAuctionDataByAuctionId$(auctionId).pipe(this.getMonitor.monitorCatch()),
        ),
        tap(auctionData => (this.auctionData = auctionData)),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }
}
