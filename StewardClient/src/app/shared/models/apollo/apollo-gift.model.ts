import { ApolloMasterInventory } from './apollo-master-inventory.model';

/** Interface for Sunrise gift. */
export interface ApolloGift {
  giftReason: string;
  inventory: ApolloMasterInventory;
}
