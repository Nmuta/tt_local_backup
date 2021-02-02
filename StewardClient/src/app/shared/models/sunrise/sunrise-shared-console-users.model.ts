/** A single shared console user. */
export interface SunriseSharedConsoleUser {
  sharedConsoleId: BigInt;
  xuid: BigInt;
  gamertag: string;
  everBanned: boolean;
}

/** The /v1/title/Sunrise/player/???/sharedConsoleUser model */
export type SunriseSharedConsoleUsers = SunriseSharedConsoleUser[];
