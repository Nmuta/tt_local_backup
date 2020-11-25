/** A single console details entry. */
export interface SunriseCreditDetailsEntry {
  eventTimestampUtc: Date;
  deviceType: string;
  creditsAfter: number;
  creditAmount: number;
  sceneName: string;
  totalXp: number;
}

/** The /v1/title/Sunrise/player/???/creditHistory model */
export type SunriseCreditHistory = SunriseCreditDetailsEntry[];
