import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionData } from '@models/auction-data';
import { GuidLikeString } from '@models/extended-types';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Contract required for a service usable with {@link AuctionDataComponent}. */
export interface AuctionDataServiceContract {
  /** Gets an auction's data by ID. */
  getAuctionDataByAuctionId$(auctionId: GuidLikeString): Observable<AuctionData>;
}

/** Gets and displays auction data based on ID. */
@Component({
  selector: 'auction-data',
  templateUrl: './auction-data.component.html',
  styleUrls: ['./auction-data.component.scss'],
})
export class AuctionDataComponent extends BaseComponent implements OnChanges {
  @Input() public auctionId: GuidLikeString;
  @Input() public service: AuctionDataServiceContract;
  public auctionData: AuctionData;
  public auctionFlags: string[] = [];
  public auctionFlagsCsv: string = ''; // TODO: a nice improvement would be to replace this CSV display with some icons, but we don't have the icons for it right now
  public getMonitor = new ActionMonitor('GET Auction Data');

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
    if (!this.service) {
      throw new Error(`No service provided to ${this.constructor.name}`);
    }

    this.service
      .getAuctionDataByAuctionId$(this.auctionId)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(auctionData => {
        const newFlags = [];
        if (auctionData.isFeatured) {
          newFlags.push('Featured');
        }
        if (auctionData.isVipAuction) {
          newFlags.push('VIP');
        }
        if (auctionData.isTurn10Auction) {
          newFlags.push('Turn 10');
        }
        if (auctionData.isHotDeal) {
          newFlags.push('Hot Deal');
        }
        this.auctionData = auctionData;
        this.auctionFlags = newFlags;
        this.auctionFlagsCsv = this.auctionFlags.join(', ');
      });
  }
}
