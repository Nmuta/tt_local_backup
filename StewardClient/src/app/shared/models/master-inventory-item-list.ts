import { MasterInventoryItem } from './master-inventory-item';

/** Interface for a master inventory item list. */
export interface MasterInventoryItemList {
  title: string;
  description: string;
  items: MasterInventoryItem[];
}
