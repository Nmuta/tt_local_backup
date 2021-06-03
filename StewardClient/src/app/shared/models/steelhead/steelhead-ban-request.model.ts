import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';
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
  xuid: BigNumber;
  gamertag: GamertagString;
  banAllConsoles: boolean;
  banAllPcs: boolean;
  deleteLeaderboardEntries: boolean;
  sendReasonNotification: boolean;
  reason: string;
  featureArea: SteelheadBanArea;
  duration: Duration;
}
