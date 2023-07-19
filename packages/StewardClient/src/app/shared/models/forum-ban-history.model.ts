import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** A forum ban history entry from Kusto. */
export interface LiveOpsBanDescription {
  isActive: boolean;
  xuid: BigNumber;
  startTimeUtc: DateTime;
  expireTimeUtc: DateTime;
  title: string;
  requesterObjectId: string;
  featureArea: string;
  reason: string;
  banParameters: string;
}
