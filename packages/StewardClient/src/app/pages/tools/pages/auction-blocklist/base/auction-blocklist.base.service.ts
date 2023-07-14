import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** Auction blocklist service interface. */
export interface AuctionBlocklistService {
  getGameTitle(): GameTitle;
  getAuctionBlocklist$(): Observable<AuctionBlocklistEntry[]>;
  postAuctionBlocklistEntries$(
    entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]>;
  deleteAuctionBlocklistEntry$(carId: BigNumber): Observable<AuctionBlocklistEntry[]>;
}
