import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';

export interface SunrisePlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
  deviceType: string; // TODO: is this an enum? https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/651883
}
