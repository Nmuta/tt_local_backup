import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for Steelhead master inventory. */
export interface SteelheadMasterInventory {
  creditRewards: MasterInventoryItem[];
  cars: MasterInventoryItem[];
  vanityItems: MasterInventoryItem[];
}
