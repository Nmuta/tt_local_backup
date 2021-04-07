import { GamertagString } from '@models/extended-types';

/** A single shared console user. */
export interface SunriseSharedConsoleUser {
  sharedConsoleId: bigint;
  xuid: bigint;
  gamertag: GamertagString;
  everBanned: boolean;
}
