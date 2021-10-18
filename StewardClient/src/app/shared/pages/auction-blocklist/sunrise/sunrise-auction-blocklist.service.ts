import { Injectable } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { SunriseService } from '@services/sunrise';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { AuctionBlocklistService } from '../base/auction-blocklist.base.service';

/**
 *  Sunrise auction blocklist service.
 */
@Injectable()
export class SunriseAuctionBlocklistService implements AuctionBlocklistService {
  constructor(private readonly sunriseService: SunriseService) {}

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH4;
  }

  /** Gets the auction blocklist. */
  public getAuctionBlocklist$(): Observable<AuctionBlocklistEntry[]> {
    return this.sunriseService.getAuctionBlocklist$();
  }

  /** Edits auction blocklist entries. */
  public postAuctionBlocklistEntries$(
    entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]> {
    return this.sunriseService.postAuctionBlocklistEntries$(entries);
  }

  /** Deletes auction blocklist entry. */
  public deleteAuctionBlocklistEntry$(carId: BigNumber): Observable<AuctionBlocklistEntry[]> {
    return this.sunriseService.deleteAuctionBlocklistEntry$(carId);
  }
}
