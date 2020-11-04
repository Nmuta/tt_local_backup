/** A single shared console user. */
export interface SunriseSharedConsoleUser {
  sharedConsoleId: number;
  xuid: number;
  gamertag: string;
  everBanned: boolean;
}

/** The /v2/title/Sunrise/player/???/sharedConsoleUser model */
export type SunriseSharedConsoleUsers = SunriseSharedConsoleUser[];
