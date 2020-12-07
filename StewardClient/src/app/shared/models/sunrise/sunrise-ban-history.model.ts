/** The /v1/title/Sunrise/player/???/banHistory model */
export interface SunriseBanHistory {
  servicesBanHistory: ServicesBanDescription[];
  liveOpsBanHistory: LiveOpsBanDescription[];
}

/** Services model for bans. */
export interface ServicesBanDescription {
  xuid: number;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: number;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: string;
}

/** LiveOps model for bans. */
export interface LiveOpsBanDescription {
  xuid: number;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  title: string;
  requestingAgent: string;
  featureArea: string;
  reason: string;
  banParameters: string;
}