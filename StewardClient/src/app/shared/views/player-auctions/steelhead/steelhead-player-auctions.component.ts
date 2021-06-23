import BigNumber from 'bignumber.js';
import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerAuctionsBaseComponent } from '../player-auctions.base.component';
import { MatDialog } from '@angular/material/dialog';
import { AuctionFilters } from '@models/auction-filters';
import { PlayerAuction } from '@models/player-auction';
import { SteelheadService } from '@services/steelhead';

/** Retreives and displays Steelhead auctions by XUID. */
@Component({
  selector: 'steelhead-player-auctions',
  templateUrl: '../player-auctions.component.html',
  styleUrls: ['../player-auctions.component.scss'],
})
export class SteelheadPlayerAuctionsComponent
  extends PlayerAuctionsBaseComponent
  implements OnChanges {
  public gameTitle = GameTitleCodeName.FM8;

  constructor(private readonly steelheadService: SteelheadService, dialog: MatDialog) {
    super(dialog);
  }

  /** Gets the console details list from XUID. */
  public getPlayerAuctionsByXuid$(
    xuid: BigNumber,
    filters: AuctionFilters,
  ): Observable<PlayerAuction[]> {
    return this.steelheadService.getPlayerAuctionsByXuid$(xuid, filters);
  }
}
