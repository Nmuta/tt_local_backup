import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
/** A single console details entry. */
export interface WoodstockCreditDetailsEntry {
  eventTimestampUtc: DateTime;
  deviceType: string;
  creditsAfter: BigNumber;
  creditAmount: BigNumber;
  sceneName: string;
  totalXp: BigNumber;
}
