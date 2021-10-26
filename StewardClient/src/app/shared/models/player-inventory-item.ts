import { DateTime } from 'luxon';
import { MasterInventoryItem } from './master-inventory-item';

/** Interface for a player inventory item. */
export interface PlayerInventoryItem extends MasterInventoryItem {
  acquiredUtc?: DateTime;
}

export function isPlayerInventoryItem(item: PlayerInventoryItem | MasterInventoryItem): boolean {
  return (item as PlayerInventoryItem).acquiredUtc !== undefined;
}
