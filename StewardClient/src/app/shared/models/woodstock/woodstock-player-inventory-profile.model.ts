import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';

export interface WoodstockPlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
  deviceType: string;
}
