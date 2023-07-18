import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { AuctionData, AuctionDataBid } from '@models/auction-data';
import { GameTitle } from '@models/enums';

/** Renders auction data. */
@Component({
  selector: 'page-auction-data',
  templateUrl: './auction-data.component.html',
  styleUrls: ['./auction-data.component.scss'],
})
export class AuctionDataComponent implements OnChanges, AfterViewInit {
  /** REVIEW-COMMENT: Auction data. */
  @Input() public auctionData: AuctionData = null;
  /** REVIEW-COMMENT: Game title. */
  @Input() public title: GameTitle = null;

  @ViewChild(MatSort) sort: MatSort;
  public bidsDisplayedColumns = ['top', 'dateUtc', 'xuid', 'amount', 'status'];
  public bidsData: BetterMatTableDataSource<AuctionDataBid> =
    new BetterMatTableDataSource<AuctionDataBid>([]);

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    this.bidsData.sort = this.sort;
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    this.bidsData = new BetterMatTableDataSource<AuctionDataBid>(this.auctionData.bids);
    this.bidsData.sort = this.sort;
  }
}
