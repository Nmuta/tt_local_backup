import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';

export interface ApolloPlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
}
