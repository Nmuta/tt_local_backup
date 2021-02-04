import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for apollo master inventory. */
export interface ApolloMasterInventory {
  cars: MasterInventoryItem[];
  vanityItems: MasterInventoryItem[];
}
