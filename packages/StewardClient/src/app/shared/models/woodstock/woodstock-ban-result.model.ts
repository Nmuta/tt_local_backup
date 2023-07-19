import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { WoodstockBanArea } from './woodstock-ban-request.model';

/** The /v1/title/Woodstock/players/ban model */
export interface WoodstockBanResult {
  xuid: BigNumber;
  success: boolean;
  banDescription: WoodstockBanDescription;
}

/** Services model for bans. */
export interface WoodstockBanDescription {
  xuid: BigNumber;
  startTimeUtc: DateTime;
  expireTimeUtc: DateTime;
  isActive: boolean;
  countOfTimesExtended: BigNumber;
  lastExtendedTimeUtc: DateTime;
  lastExtendedReason: string;
  reason: string;
  featureArea: WoodstockBanArea;
}
