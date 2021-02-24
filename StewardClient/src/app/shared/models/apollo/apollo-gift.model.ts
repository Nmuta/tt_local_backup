import { ApolloMasterInventory } from './apollo-master-inventory.model';

/** Interface for an Apollo gift. */
export interface ApolloGift {
  giftReason: string;
  inventory: ApolloMasterInventory;
}
