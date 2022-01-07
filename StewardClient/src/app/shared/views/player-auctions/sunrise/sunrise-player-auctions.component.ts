import BigNumber from 'bignumber.js';
import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { PlayerAuctionsBaseComponent } from '../player-auctions.base.component';
import { MatDialog } from '@angular/material/dialog';
import { AuctionFilters } from '@models/auction-filters';
import { PlayerAuction } from '@models/player-auction';

/** Retreives and displays Sunrise auctions by XUID. */
@Component({
  selector: 'sunrise-player-auctions',
  templateUrl: '../player-auctions.component.html',
  styleUrls: ['../player-auctions.component.scss'],
})
export class SunrisePlayerAuctionsComponent
  extends PlayerAuctionsBaseComponent
  implements OnChanges
{
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseSerice: SunriseService, dialog: MatDialog) {
    super(dialog);
  }

  /** Gets the console details list from XUID. */
  public getPlayerAuctionsByXuid$(
    xuid: BigNumber,
    filters: AuctionFilters,
  ): Observable<PlayerAuction[]> {
    return this.sunriseSerice.getPlayerAuctionsByXuid$(xuid, filters);
  }
}
