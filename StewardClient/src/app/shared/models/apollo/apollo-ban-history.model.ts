import { GuidLikeString } from '@models/extended-types';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { ApolloBanArea } from './apollo-ban-request.model';

/** A ban history entry from apollo. */
export interface ApolloBanHistoryEntry {
  isActive: boolean;
  startTimeUtc: DateTime;
  expireTimeUtc: DateTime;
  lastExtendedTimeUtc: DateTime;
  countOfTimesExtended: BigNumber;
  xuid: BigNumber;
  title: 'apollo';
  requesterObjectId: GuidLikeString;
  featureArea: ApolloBanArea;
  reason: string;
  banParameters: string;
}
