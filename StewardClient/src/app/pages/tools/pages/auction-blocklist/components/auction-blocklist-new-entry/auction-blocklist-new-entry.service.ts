import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';

/** Auction blocklist new entry service interface. */
export interface AuctionBlocklistNewEntryService {
  getGameTitle(): GameTitle;
  postAuctionBlocklistEntries$(
    entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]>;
}
