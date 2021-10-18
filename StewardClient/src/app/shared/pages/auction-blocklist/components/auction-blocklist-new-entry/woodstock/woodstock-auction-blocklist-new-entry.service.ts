import { Injectable } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { WoodstockService } from '@services/woodstock';
import { Observable } from 'rxjs';
import { AuctionBlocklistNewEntryService } from '../auction-blocklist-new-entry.service';

/**
 *  Woodstock auction blocklist new entry service.
 */
@Injectable()
export class WoodstockAuctionBlocklistNewEntryService implements AuctionBlocklistNewEntryService {
  constructor(private readonly woodstockService: WoodstockService) {}

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH5;
  }

  /** Edits auction blocklist entries. */
  public postAuctionBlocklistEntries$(
    entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]> {
    return this.woodstockService.postAuctionBlocklistEntries$(entries);
  }
}
