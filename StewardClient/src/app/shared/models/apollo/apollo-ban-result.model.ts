import BigNumber from 'bignumber.js';
import { ApolloBanArea } from './apollo-ban-request.model';

/** The /v1/title/Apollo/players/ban model */
export interface ApolloBanResult {
  xuid: BigNumber;
  success: boolean;
  banDescription: ApolloBanDescription;
}

/** Services model for bans. */
export interface ApolloBanDescription {
  xuid: BigNumber;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: BigNumber;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: ApolloBanArea;
}
