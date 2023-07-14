import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { WoodstockAuctionsService } from '@services/api-v2/woodstock/auctions/woodstock-auctions.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { CreateSingleAuctionContract } from '../create-single-auction.component';
import { WoodstockService } from '@services/woodstock';

/** The Woodstock create single auction component. */
@Component({
  selector: 'woodstock-create-single-auction',
  templateUrl: './woodstock-create-single-auction.component.html',
  styleUrls: ['./woodstock-create-single-auction.component.scss'],
})
export class WoodstockCreateSingleAuctionComponent extends BaseComponent {
  public createSingleAuctionContract: CreateSingleAuctionContract;

  constructor(
    woodstockAuctionsService: WoodstockAuctionsService,
    woodstockService: WoodstockService,
  ) {
    super();

    this.createSingleAuctionContract = {
      gameTitle: GameTitle.FH5,
      createSingleAuction$(
        carId: BigNumber,
        openingPrice: number,
        buyoutPrice: number,
        durationInMS: number,
        sellerId: BigNumber,
      ): Observable<string> {
        return woodstockAuctionsService.createSingleAuction$(
          carId,
          openingPrice,
          buyoutPrice,
          durationInMS,
          sellerId,
        );
      },
      getAllCars$: () => woodstockService.getSimpleCars$(),
    };
  }
}
