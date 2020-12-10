import { ApolloPlayerInventory } from './apollo-player-inventory.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  playerId: string;
  title: string;
  giftSendDateUtc: unknown;
  giftInventory: ApolloPlayerInventory;
}
