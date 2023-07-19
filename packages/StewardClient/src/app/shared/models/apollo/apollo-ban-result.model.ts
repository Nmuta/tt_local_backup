import { MSError } from '@models/error.model';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { ApolloBanArea } from './apollo-ban-request.model';

/** The /v1/title/Apollo/players/ban model */
export interface ApolloBanResult {
  xuid: BigNumber;
  error: MSError;
  banDescription: ApolloBanDescription;
}

/** Services model for bans. */
export interface ApolloBanDescription {
  xuid: BigNumber;
  startTimeUtc: DateTime;
  expireTimeUtc: DateTime;
  isActive: boolean;
  countOfTimesExtended: BigNumber;
  lastExtendedTimeUtc: DateTime;
  lastExtendedReason: string;
  reason: string;
  featureArea: ApolloBanArea;
}
