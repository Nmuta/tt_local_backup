import BigNumber from 'bignumber.js';
import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerAuctionsBaseComponent } from '../player-auctions.base.component';
import { MatDialog } from '@angular/material/dialog';
import { AuctionFilters } from '@models/auction-filters';
import { PlayerAuction } from '@models/player-auction';
import { WoodstockService } from '@services/woodstock';

/** Retreives and displays Woodstock auctions by XUID. */
@Component({
  selector: 'woodstock-player-auctions',
  templateUrl: '../player-auctions.component.html',
  styleUrls: ['../player-auctions.component.scss'],
})
export class WoodstockPlayerAuctionsComponent
  extends PlayerAuctionsBaseComponent
  implements OnChanges
{
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstockService: WoodstockService, dialog: MatDialog) {
    super(dialog);
  }

  /** Gets the console details list from XUID. */
  public getPlayerAuctionsByXuid$(
    xuid: BigNumber,
    filters: AuctionFilters,
  ): Observable<PlayerAuction[]> {
    return this.woodstockService.getPlayerAuctionsByXuid$(xuid, filters);
  }
}
