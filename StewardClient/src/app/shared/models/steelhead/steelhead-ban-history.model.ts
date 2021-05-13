import { GuidLikeString } from '@models/extended-types';
import BigNumber from 'bignumber.js';
import { SteelheadBanArea } from './steelhead-ban-request.model';

/** A ban history entry from Steelhead. */
export interface SteelheadBanHistoryEntry {
  isActive: boolean;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  lastExtendedTimeUtc: Date;
  countOfTimesExtended: BigNumber;
  xuid: BigNumber;
  title: 'steelhead';
  requesterObjectId: GuidLikeString;
  featureArea: SteelheadBanArea;
  reason: string;
  banParameters: string;
}
