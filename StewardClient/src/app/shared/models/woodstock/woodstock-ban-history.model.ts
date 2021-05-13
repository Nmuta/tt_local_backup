import BigNumber from 'bignumber.js';
// TODO: This model can be simplied since we are only using LiveOpsBanDescription now

/** The /v1/title/Woodstock/player/???/banHistory model */
export interface WoodstockBanHistory {
  liveOpsBanHistory: LiveOpsBanDescription[];
}

/** LiveOps model for a single ban description. */
export interface LiveOpsBanDescription {
  isActive: boolean;
  xuid: BigNumber;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  title: string;
  requesterObjectId: string;
  featureArea: string;
  reason: string;
  banParameters: string;
}

/** LiveOps model for multiple ban descriptions. */
export type LiveOpsBanDescriptions = LiveOpsBanDescription[];
