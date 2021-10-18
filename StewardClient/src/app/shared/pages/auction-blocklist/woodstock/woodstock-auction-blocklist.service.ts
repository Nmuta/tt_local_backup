import { Injectable } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { WoodstockService } from '@services/woodstock';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { AuctionBlocklistService } from '../base/auction-blocklist.base.service';

/**
 *  Woodstock auction blocklist service.
 */
@Injectable()
export class WoodstockAuctionBlocklistService implements AuctionBlocklistService {
  constructor(private readonly woodstockService: WoodstockService) {}

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH5;
  }

  /** Gets the auction blocklist. */
  public getAuctionBlocklist$(): Observable<AuctionBlocklistEntry[]> {
    return this.woodstockService.getAuctionBlocklist$();
  }

  /** Edits auction blocklist entries. */
  public postAuctionBlocklistEntries$(
    entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]> {
    return this.woodstockService.postAuctionBlocklistEntries$(entries);
  }

  /** Deletes auction blocklist entry. */
  public deleteAuctionBlocklistEntry$(carId: BigNumber): Observable<AuctionBlocklistEntry[]> {
    return this.woodstockService.deleteAuctionBlocklistEntry$(carId);
  }
}
