import { ApolloGift } from './apollo-gift.model';

/** Interface for an Apollo group gift. */
export interface ApolloGroupGift extends ApolloGift {
  xuids: bigint[];
}
