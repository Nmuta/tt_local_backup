import { SunriseBanArea } from './sunrise-ban-request.model';

/** The /v1/title/Sunrise/players/ban model */
export interface SunriseBanResult {
  xuid: BigInt;
  success: boolean;
  banDescription: SunriseBanDescription;
}

/** Services model for bans. */
export interface SunriseBanDescription {
  xuid: BigInt;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: number;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: SunriseBanArea;
}
