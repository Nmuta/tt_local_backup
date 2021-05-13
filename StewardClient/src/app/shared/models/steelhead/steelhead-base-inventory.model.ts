import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for Steelhead base inventory. */
export interface SteelheadBaseInventory<T extends MasterInventoryItem> {
  creditRewards: T[];
  cars: T[];
  vanityItems: T[];
}
