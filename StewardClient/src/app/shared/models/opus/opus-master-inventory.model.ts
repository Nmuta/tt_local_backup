import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for opus master inventory. */
export interface OpusMasterInventory {
  creditRewards: MasterInventoryItem[];
  cars: MasterInventoryItem[];
}
