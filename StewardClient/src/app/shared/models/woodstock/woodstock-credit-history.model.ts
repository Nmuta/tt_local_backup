import BigNumber from 'bignumber.js';
/** A single console details entry. */
export interface WoodstockCreditDetailsEntry {
  eventTimestampUtc: Date;
  deviceType: string;
  creditsAfter: BigNumber;
  creditAmount: BigNumber;
  sceneName: string;
  totalXp: BigNumber;
}
