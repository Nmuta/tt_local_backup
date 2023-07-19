import { MasterInventoryItem } from '@models/master-inventory-item';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';

/** Utility method for generating master inventory list to display. */
export function makeItemList(title: string, items: MasterInventoryItem[]): PlayerInventoryItemList {
  return {
    title: title,
    description: `${items.length} Total`,
    items: items,
  } as PlayerInventoryItemList;
}
