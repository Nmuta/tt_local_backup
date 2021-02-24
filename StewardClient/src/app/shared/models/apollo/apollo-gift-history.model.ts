import { GiftIdentityAntecedent } from '@shared/constants';
import { ApolloGift } from './apollo-gift.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigInt;
  title: 'apollo';
  giftSendDateUtc: Date;
  giftInventory: ApolloGift;
  requestingAgent: string;
}
