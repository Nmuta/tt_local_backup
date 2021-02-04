import { GamertagString } from '@models/extended-types';

/** A single shared console user. */
export interface SunriseSharedConsoleUser {
  sharedConsoleId: BigInt;
  xuid: BigInt;
  gamertag: GamertagString;
  everBanned: boolean;
}

/** The /v1/title/Sunrise/player/???/sharedConsoleUser model */
export type SunriseSharedConsoleUsers = SunriseSharedConsoleUser[];
