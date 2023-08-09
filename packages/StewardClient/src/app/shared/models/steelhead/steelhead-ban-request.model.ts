import BigNumber from 'bignumber.js';
import { Duration } from 'luxon';

export enum SteelheadBanArea {
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

/** A single part of the bulk /v1/title/steelhead/players/ban request model */
export interface SteelheadBanRequest {
  xuid?: BigNumber;
  deleteLeaderboardEntries: boolean;
  reasonGroupName: string;
  reason: string;
  override: boolean;
  overrideDuration?: Duration;
  overrideDurationPermanent?: boolean;
  overrideBanConsoles?: boolean;
}
