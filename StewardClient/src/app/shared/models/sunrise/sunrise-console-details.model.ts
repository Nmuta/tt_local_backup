/** A single console details entry. */
export interface SunriseConsoleDetailsEntry {
  consoleId: string;
  isBanned: boolean;
  isBannable: boolean;
  deviceType: string;
  clientVersion: string;
}

/** The /v2/title/Sunrise/player/???/consoleDetails model */
export type SunriseConsoleDetails = SunriseConsoleDetailsEntry[];