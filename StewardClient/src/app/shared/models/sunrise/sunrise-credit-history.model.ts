import BigNumber from 'bignumber.js';
/** A single console details entry. */
export interface SunriseCreditDetailsEntry {
  eventTimestampUtc: Date;
  deviceType: string;
  creditsAfter: BigNumber;
  creditAmount: BigNumber;
  sceneName: string;
  totalXp: BigNumber;
}

/** The /v1/title/Sunrise/player/???/creditHistory model */
export type SunriseCreditHistory = SunriseCreditDetailsEntry[];
