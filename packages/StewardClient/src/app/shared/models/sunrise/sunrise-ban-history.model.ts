import { GuidLikeString } from '@models/extended-types';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
// TODO: This model can be simplied since we are only using LiveOpsBanDescription now

/** The /v1/title/Sunrise/player/???/banHistory model */
export interface SunriseBanHistory {
  liveOpsBanHistory: LiveOpsBanDescription[];
}

/** LiveOps model for a single ban description. */
export interface LiveOpsBanDescription {
  isActive: boolean;
  xuid: BigNumber;
  startTimeUtc: DateTime;
  expireTimeUtc: DateTime;
  title: string;
  requesterObjectId: GuidLikeString;
  featureArea: string;
  reason: string;
  banParameters: string;
}

/** LiveOps model for multiple ban descriptions. */
export type LiveOpsBanDescriptions = LiveOpsBanDescription[];
