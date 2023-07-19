import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for apollo base inventory. */
export interface ApolloBaseInventory<T extends MasterInventoryItem> {
  creditRewards: T[];
  cars: T[];
  vanityItems: T[];
}
