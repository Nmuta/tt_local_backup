import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';

export interface SteelheadPlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
}
