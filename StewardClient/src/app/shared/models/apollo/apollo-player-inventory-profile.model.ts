import { GuidLikeString } from '@models/extended-types';

export interface ApolloPlayerInventoryProfile {
  profileId: bigint;
  externalProfileId: GuidLikeString
  isCurrent: boolean;
}