import { GamertagString, T10IdString } from '@models/extended-types';

/** Interface for gravity player details. */
export interface GravityPlayerDetails {
  xuid: bigint;
  gamertag: GamertagString;
  t10Id: T10IdString;
  playFabId: string;
  userInventoryId: string;
  lcid: bigint;
  country: bigint;
  region: bigint;
  ipAddress: string;
  subscriptionTier: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  ageGroup: unknown;
  timeOffsetInSeconds: bigint;
  lastGameSettingsUsed: unknown;
  saveStates: unknown[];
}
