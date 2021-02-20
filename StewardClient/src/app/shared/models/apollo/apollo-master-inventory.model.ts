import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for apollo master inventory. */
export interface ApolloMasterInventory {
  creditRewards: MasterInventoryItem[];
  cars: MasterInventoryItem[];
  vanityItems: MasterInventoryItem[];
}
