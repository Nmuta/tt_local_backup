import { GuidLikeString } from '@models/extended-types';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { SteelheadBanArea } from './steelhead-ban-request.model';

/** A ban history entry from Steelhead. */
export interface SteelheadBanHistoryEntry {
  isActive: boolean;
  startTimeUtc: DateTime;
  expireTimeUtc: DateTime;
  lastExtendedTimeUtc: DateTime;
  countOfTimesExtended: BigNumber;
  xuid: BigNumber;
  title: 'steelhead';
  requesterObjectId: GuidLikeString;
  featureArea: SteelheadBanArea;
  reason: string;
  banParameters: string;
}
