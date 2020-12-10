/** The /v1/title/Apollo/players/ban model */
export interface ApolloBanResult {
  xuid: number;
  success: boolean;
  BanDescription: ApolloBanDescription
}

/** Services model for bans. */
export interface ApolloBanDescription {
  xuid: number;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: number;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: string;
}
