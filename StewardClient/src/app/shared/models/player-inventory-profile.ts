import BigNumber from 'bignumber.js';
import { DeviceType } from './enums';
import { GuidLikeString } from './extended-types';

export interface PlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId?: GuidLikeString;
  isCurrent: boolean;
}

export interface SteelheadPlayerInventoryProfile extends PlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
  isCurrentByTitleId: boolean;
  deviceType: DeviceType;
  titleId: number;
}

export type ExtendedPlayerInventoryProfile = PlayerInventoryProfile &
  Partial<SteelheadPlayerInventoryProfile>;
