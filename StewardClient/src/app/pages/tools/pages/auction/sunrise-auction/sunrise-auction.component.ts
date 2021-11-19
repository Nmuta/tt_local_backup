import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionData } from '@models/auction-data';
import { GameTitleAbbreviation } from '@models/enums';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

/** A component that retrieves and renders sunrise auction data from path parameters. */
@Component({
  templateUrl: './sunrise-auction.component.html',
  styleUrls: ['./sunrise-auction.component.scss'],
})
export class SunriseAuctionComponent extends BaseComponent implements OnInit {
  public auctionId: string;
  public auctionData: AuctionData;
  public GameTitleAbbreviation = GameTitleAbbreviation;

  public getMonitor: ActionMonitor = new ActionMonitor('GET FH4 Auction Data');

  constructor(private readonly route: ActivatedRoute, private readonly sunrise: SunriseService) {
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
          this.sunrise.getAuctionDataByAuctionId$(auctionId).pipe(this.getMonitor.monitorCatch()),
        ),
        tap(auctionData => (this.auctionData = auctionData)),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }
}
