import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { WoodstockAuctionsService } from '@services/api-v2/woodstock/auctions/woodstock-auctions.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { CreateBulkAuctionContract } from '../create-bulk-auction.component';

/** The Woodstock create bulk auction component. */
@Component({
  selector: 'woodstock-create-bulk-auction',
  templateUrl: './woodstock-create-bulk-auction.component.html',
  styleUrls: ['./woodstock-create-bulk-auction.component.scss'],
})
export class WoodstockCreateBulkAuctionComponent extends BaseComponent {
  public createBulkAuctionContract: CreateBulkAuctionContract;

  constructor(woodstockAuctionsService: WoodstockAuctionsService) {
    super();

    this.createBulkAuctionContract = {
      gameTitle: GameTitle.FH5,
      createBulkAuction$(
        sellerId: BigNumber,
        oneOfEveryCar: boolean,
        numberOfRandomCars: number,
        durationInMinutes: number,
      ): Observable<string[]> {
        return woodstockAuctionsService.createBulkAuction$(
          sellerId,
          oneOfEveryCar,
          numberOfRandomCars,
          durationInMinutes,
        );
      },
    };
  }
}
