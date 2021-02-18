import { GuidLikeString } from '@models/extended-types';

export interface SunrisePlayerInventoryProfile {
  profileId: bigint;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
  deviceType: string; // TODO: is this an enum? https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/651883
}
