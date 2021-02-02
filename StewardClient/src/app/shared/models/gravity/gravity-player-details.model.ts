/** Interface for gravity player details. */
export interface GravityPlayerDetails {
  xuid: BigInt;
  gamertag: string;
  t10Id: string;
  playFabId: string;
  userInventoryId: string;
  lcid: BigInt;
  country: BigInt;
  region: BigInt;
  ipAddress: string;
  subscriptionTier: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  ageGroup: unknown;
  timeOffsetInSeconds: BigInt;
  lastGameSettingsUsed: unknown;
  saveStates: unknown[];
}
