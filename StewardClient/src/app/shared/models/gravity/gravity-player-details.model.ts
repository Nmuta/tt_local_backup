import BigNumber from 'bignumber.js';
import { GamertagString, GuidLikeString, T10IdString } from '@models/extended-types';
import { GravitySaveState } from './gravity-save-state.model';

/** Interface for gravity player details. */
export interface GravityPlayerDetails {
  xuid: BigNumber;
  gamertag: GamertagString;
  t10Id: T10IdString;
  playFabId: string;
  userInventoryId: string;
  lcid: BigNumber;
  country: BigNumber;
  region: BigNumber;
  ipAddress: string;
  subscriptionTier: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  ageGroup: BigNumber;
  timeOffsetInSeconds: BigNumber;
  lastGameSettingsUsed: GuidLikeString;
  saveStates: GravitySaveState[];
}
