import BigNumber from 'bignumber.js';
import { SteelheadBanArea } from './steelhead-ban-request.model';

/** The /v1/title/steelhead/players/ban model */
export interface SteelheadBanResult {
  xuid: BigNumber;
  success: boolean;
  banDescription: SteelheadBanDescription;
}

/** Services model for bans. */
export interface SteelheadBanDescription {
  xuid: BigNumber;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: BigNumber;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: SteelheadBanArea;
}
