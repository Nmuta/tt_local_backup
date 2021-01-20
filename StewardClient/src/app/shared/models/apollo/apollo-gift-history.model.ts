import { ApolloPlayerInventory } from './apollo-player-inventory.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  playerId: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: ApolloPlayerInventory;
}

/** LiveOps model for multiple gift history descriptions. */
export type ApolloGiftHistories = ApolloGiftHistory[];
