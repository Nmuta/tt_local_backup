import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
// TODO: This model can be simplied since we are only using LiveOpsBanDescription now

/** The /v1/title/Woodstock/player/???/banHistory model */
export interface WoodstockBanHistory {
  liveOpsBanHistory: LiveOpsBanDescription[];
}

/** LiveOps model for a single ban description. */
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

/** LiveOps model for multiple ban descriptions. */
export type LiveOpsBanDescriptions = LiveOpsBanDescription[];

/** LiveOps model for multiple ban descriptions with uniquely identifiable bans. */
export interface LiveOpsExtendedBanDescription extends LiveOpsBanDescription {
  isDeleted?: boolean;
  banEntryId?: BigNumber;
}

/** LiveOps model for multiple extended ban descriptions. */
export type LiveOpsExtendedBanDescriptions = LiveOpsBanDescription[];
