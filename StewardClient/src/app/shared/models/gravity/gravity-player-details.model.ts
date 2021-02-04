import { GamertagString, Turn10IdString } from '@models/extended-types';

/** Interface for gravity player details. */
export interface GravityPlayerDetails {
  xuid: bigint;
  gamertag: GamertagString;
  t10Id: Turn10IdString;
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
