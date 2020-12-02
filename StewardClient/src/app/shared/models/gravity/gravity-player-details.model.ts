/** Interface for gravity player details. */
export interface GravityPlayerDetails {
  xuid: BigInt;
  gamertag: string;
  turn10Id: string;
  playFabId: string;
  userInventoryId: string;
  lcid: number;
  country: number;
  region: number;
  ipAddress: string;
  subscriptionTier: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  ageGroup: unknown;
  timeOffsetInSeconds: number;
  lastGameSettingsUsed: unknown;
  saveStates: unknown[];
}
