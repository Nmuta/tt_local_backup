import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** Interface for an auction house blocklist entry. */
export interface AuctionBlocklistEntry {
  expireDateUtc: DateTime;
  doesExpire: boolean;
  carId: BigNumber;
  description: string;
}
