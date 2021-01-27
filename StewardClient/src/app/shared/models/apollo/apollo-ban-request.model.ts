import * as moment from 'moment';

export enum ApolloBanArea {
  AllRequests = 'AllRequests',
  Community = 'Community',
  DailyCredit = 'DailyCredit',
  Drivatar = 'Drivatar',
  Internal = 'Internal',
  Logging = 'Logging',
  Matchmaking = 'Matchmaking',
  OnlineProfile = 'OnlineProfile',
  Packs = 'Packs',
  Scoreboards = 'Scoreboards',
  Test = 'Test',
  UserGeneratedContent = 'UserGeneratedContent',
}

/** A single part of the bulk /v1/title/Apollo/players/ban request model */
export interface ApolloBanRequest {
  xuid: BigInt;
  gamertag: string;
  banAllConsoles: boolean;
  banAllPcs: boolean;
  deleteLeaderboardEntries: boolean;
  sendReasonNotification: boolean;
  reason: string;
  featureArea: ApolloBanArea;
  duration: moment.Duration;
}

/** Services model for bans. */
export interface ApolloBanDescription {
  xuid: BigInt;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  isActive: boolean;
  countOfTimesExtended: BigInt;
  lastExtendedTimeUtc: Date;
  lastExtendedReason: string;
  reason: string;
  featureArea: ApolloBanArea;
}
