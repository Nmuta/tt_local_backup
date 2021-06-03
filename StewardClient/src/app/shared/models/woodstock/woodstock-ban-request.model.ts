import BigNumber from 'bignumber.js';
import { Duration } from 'luxon';

export enum WoodstockBanArea {
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

/** A single part of the bulk /v1/title/Woodstock/players/ban request model */
export interface WoodstockBanRequest {
  xuid?: BigNumber;
  gamertag?: string;
  banAllConsoles: boolean;
  banAllPcs: boolean;
  deleteLeaderboardEntries: boolean;
  sendReasonNotification: boolean;
  reason: string;
  featureArea: WoodstockBanArea;
  duration: Duration;
}
