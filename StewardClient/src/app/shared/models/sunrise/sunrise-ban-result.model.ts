/** The /v1/title/Sunrise/players/ban model */
export interface SunriseBanResult {
  xuid: number;
  success: boolean;
  BanDescription: SunriseBanDescription
}

/** Services model for bans. */
export interface SunriseBanDescription {
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
