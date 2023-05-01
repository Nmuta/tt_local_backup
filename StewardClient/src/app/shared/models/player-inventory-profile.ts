import BigNumber from 'bignumber.js';
import { DeviceType } from './enums';
import { GuidLikeString } from './extended-types';

/** Interface for a player inventory profile. Currently used by Apollo and Opus. */
export interface PlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId?: GuidLikeString;
  isCurrent: boolean;
}

/** Interface for an player inventory profile with device type. Currently used by Woodstock and Sunrise. */
export interface PlayerInventoryProfileWithDeviceType extends PlayerInventoryProfile {
  deviceType?: DeviceType;
}

/** Interface for an player inventory profile with most properties. Currently used by Steelhead. */
export interface FullPlayerInventoryProfile extends PlayerInventoryProfileWithDeviceType {
  isCurrentByTitleId?: boolean;
  titleId?: number;
}
