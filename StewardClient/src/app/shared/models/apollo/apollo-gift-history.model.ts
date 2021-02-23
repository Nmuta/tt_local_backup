import { ApolloGift } from './apollo-gift.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  idType: string;
  id: BigInt;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: ApolloGift;
  requestingAgent: string;
}
