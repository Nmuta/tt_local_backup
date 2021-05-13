import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for opus base inventory. */
export interface OpusBaseInventory<T extends MasterInventoryItem> {
  creditRewards: T[];
  cars: T[];
}
