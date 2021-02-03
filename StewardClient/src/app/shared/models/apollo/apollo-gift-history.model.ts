import { ApolloPlayerInventory } from './apollo-player-inventory.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  idType: string;
  id: BigInt;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: ApolloPlayerInventory;
  requestingAgent: string;
}
