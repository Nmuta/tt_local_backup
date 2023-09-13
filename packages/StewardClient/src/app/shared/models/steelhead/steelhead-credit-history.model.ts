import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** A single credit event entry. */
export interface SteelheadCreditDetailsEntry {
  eventTimestampUtc: DateTime;
  creditsAfter: BigNumber;
  creditAmount: BigNumber;
}
