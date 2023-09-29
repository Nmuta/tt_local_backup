import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** A single credit event entry. */
export interface SteelheadCreditDetailsEntry {
  eventTimestampUtc: DateTime;
  deviceType: string;
  creditsAfter: BigNumber;
  creditAmount: BigNumber;
  sceneName: string;
  totalXp: BigNumber;
}
