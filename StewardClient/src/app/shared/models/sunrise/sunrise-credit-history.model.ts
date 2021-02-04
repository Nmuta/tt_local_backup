/** A single console details entry. */
export interface SunriseCreditDetailsEntry {
  eventTimestampUtc: Date;
  deviceType: string;
  creditsAfter: bigint;
  creditAmount: bigint;
  sceneName: string;
  totalXp: bigint;
}

/** The /v1/title/Sunrise/player/???/creditHistory model */
export type SunriseCreditHistory = SunriseCreditDetailsEntry[];
