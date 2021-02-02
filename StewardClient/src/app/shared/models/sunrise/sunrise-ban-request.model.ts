import * as moment from 'moment';

export enum SunriseBanArea {
  AllRequests = 'AllRequests',
  AuctionHouse = 'AuctionHouse',
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

/** A single part of the bulk /v1/title/Sunrise/players/ban request model */
export interface SunriseBanRequest {
  xuid?: BigInt;
  gamertag?: string;
  banAllConsoles: boolean;
  banAllPcs: boolean;
  deleteLeaderboardEntries: boolean;
  sendReasonNotification: boolean;
  reason: string;
  featureArea: SunriseBanArea;
  duration: moment.Duration;
}
