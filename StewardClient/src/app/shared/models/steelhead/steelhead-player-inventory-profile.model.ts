import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';
import { DeviceType } from '@models/enums';

export interface SteelheadPlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isLastLoggedInProfile: boolean;
  isCurrentByTitleId: boolean;  
  deviceType: DeviceType;
  titleId: number;
}
