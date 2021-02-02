/** A single console details entry. */
export interface SunriseCreditDetailsEntry {
  eventTimestampUtc: Date;
  deviceType: string;
  creditsAfter: BigInt;
  creditAmount: BigInt;
  sceneName: string;
  totalXp: BigInt;
}

/** The /v1/title/Sunrise/player/???/creditHistory model */
export type SunriseCreditHistory = SunriseCreditDetailsEntry[];
