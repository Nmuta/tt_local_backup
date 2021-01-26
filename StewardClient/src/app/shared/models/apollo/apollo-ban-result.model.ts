import { ApolloBanArea } from './apollo-ban-request.model';

/** The /v1/title/Apollo/players/ban model */
export interface ApolloBanResult {
  xuid: number;
  success: boolean;
  banDescription: ApolloBanDescription;
}

/** Services model for bans. */
export interface ApolloBanDescription {
  xuid: BigInt;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: number;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: ApolloBanArea;
}
