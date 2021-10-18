import { Injectable } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import { AuctionBlocklistNewEntryService } from '../auction-blocklist-new-entry.service';

/**
 *  Sunrise auction blocklist new entry service.
 */
@Injectable()
export class SunriseAuctionBlocklistNewEntryService implements AuctionBlocklistNewEntryService {
  constructor(private readonly sunriseService: SunriseService) {}

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH4;
  }

  /** Edits auction blocklist entries. */
  public postAuctionBlocklistEntries$(
    entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]> {
    return this.sunriseService.postAuctionBlocklistEntries$(entries);
  }
}
