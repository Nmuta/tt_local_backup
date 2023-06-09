import BigNumber from 'bignumber.js';
import { Duration } from 'luxon';

/** Woodstock Ban Area */
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

/** A single part of the bulk /v2/title/Woodstock/players/ban request model */
export interface WoodstockBanRequest {
  xuid?: BigNumber;
  gamertag?: string;
  deleteLeaderboardEntries: boolean;
  reasonGroupName: string;
  reason: string;
  override: boolean;
  overrideDuration?: Duration;
  overrideDurationPermanent?: boolean;
  overrideBanConsoles?: boolean;
}
