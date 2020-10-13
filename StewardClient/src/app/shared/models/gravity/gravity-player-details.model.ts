/** Interface for gravity player details. */
export interface GravityPlayerDetails {
  xuid?: any;
  gamertag?: string;
  turn10Id?: string;
  playFabId?: string;
  userInventoryId?: string;
  lcid?: number;
  country?: number;
  region?: number;
  ipAddress?: string;
  subscriptionTier?: string;
  lastLoginUtc?: any;
  firstLoginUtc?: any;
  ageGroup?: any;
  timeOffsetInSeconds?: number;
  lastGameSettingsUsed?: any;
  saveStates?: any[];
}
