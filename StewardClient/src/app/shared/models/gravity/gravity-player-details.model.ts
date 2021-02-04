import { GamertagString, T10IdString } from '@models/extended-types';

/** Interface for gravity player details. */
export interface GravityPlayerDetails {
  xuid: BigInt;
  gamertag: GamertagString;
  t10Id: T10IdString;
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
