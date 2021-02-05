// TODO: This model can be simplied since we are only using LiveOpsBanDescription now

/** The /v1/title/Sunrise/player/???/banHistory model */
export interface SunriseBanHistory {
  liveOpsBanHistory: LiveOpsBanDescription[];
}

/** LiveOps model for a single ban description. */
export interface LiveOpsBanDescription {
  isActive: boolean;
  xuid: bigint;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  title: string;
  requestingAgent: string;
  featureArea: string;
  reason: string;
  banParameters: string;
}

/** LiveOps model for multiple ban descriptions. */
export type LiveOpsBanDescriptions = LiveOpsBanDescription[];
