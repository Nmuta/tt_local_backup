import { ApolloBanArea } from './apollo-ban-request.model';

/** The /v1/title/Apollo/players/ban model */
export interface ApolloBanResult {
  xuid: bigint;
  success: boolean;
  banDescription: ApolloBanDescription;
}

/** Services model for bans. */
export interface ApolloBanDescription {
  xuid: bigint;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: bigint;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: ApolloBanArea;
}
