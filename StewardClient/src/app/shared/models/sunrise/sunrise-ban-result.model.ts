import { SunriseBanArea } from './sunrise-ban-request.model';

/** The /v1/title/Sunrise/players/ban model */
export interface SunriseBanResult {
  xuid: bigint;
  success: boolean;
  banDescription: SunriseBanDescription;
}

/** Services model for bans. */
export interface SunriseBanDescription {
  xuid: bigint;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: bigint;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: SunriseBanArea;
}
