import BigNumber from 'bignumber.js';
import { SunriseBanArea } from './sunrise-ban-request.model';

/** The /v1/title/Sunrise/players/ban model */
export interface SunriseBanResult {
  xuid: BigNumber;
  success: boolean;
  banDescription: SunriseBanDescription;
}

/** Services model for bans. */
export interface SunriseBanDescription {
  xuid: BigNumber;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: BigNumber;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: SunriseBanArea;
}
