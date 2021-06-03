import { DateTime } from 'luxon';
import { MasterInventoryItem } from './master-inventory-item';

/** Interface for a player inventory item. */
export interface PlayerInventoryItem extends MasterInventoryItem {
  dateAquiredUtc?: DateTime;
}

export function isPlayerInventoryItem(item: PlayerInventoryItem | MasterInventoryItem): boolean {
  return (item as PlayerInventoryItem).dateAquiredUtc !== undefined;
}
