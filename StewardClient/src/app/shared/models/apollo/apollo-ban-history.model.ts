import { GuidLikeString } from '@models/extended-types';
import BigNumber from 'bignumber.js';
import { ApolloBanArea } from './apollo-ban-request.model';

/** A ban history entry from apollo. */
export interface ApolloBanHistoryEntry {
  isActive: boolean;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  lastExtendedTimeUtc: Date;
  countOfTimesExtended: BigNumber;
  xuid: BigNumber;
  title: 'apollo';
  requesterObjectId: GuidLikeString;
  featureArea: ApolloBanArea;
  reason: string;
  banParameters: string;
}
