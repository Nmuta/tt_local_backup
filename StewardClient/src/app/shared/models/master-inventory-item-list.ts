import { MasterInventoryItem } from './master-inventory-item';
import { PlayerInventoryItem } from './player-inventory-item';

/** Interface for a player inventory item list. */
export interface PlayerInventoryItemList {
  title: string;
  description: string;
  items: (PlayerInventoryItem | MasterInventoryItem)[];
}
