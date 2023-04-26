import { MasterInventoryItem } from '@models/master-inventory-item';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { cloneDeep } from 'lodash';

/** Utility method for generating master inventory list to display. */
export function makeItemList(title: string, items: MasterInventoryItem[]): PlayerInventoryItemList {
  return {
    title: title,
    description: `${items.length} Total`,
    items: items,
  };
}

/** Utility method for adding warnings to a inventory list. Creates new list. */
export function addWarnings(
  list: PlayerInventoryItemList,
  ids: Set<string>,
  icon: string,
  color: 'warn' | 'accent' | 'primary',
  text: string,
): PlayerInventoryItemList {
  const newList = cloneDeep(list);
  let modifiedAny = false;
  for (const item of newList.items) {
    if (ids.has(item.id.toString())) {
      modifiedAny = true;
      item.warnings = item.warnings ?? [];
      item.warnings.push({ icon, color, text });
    }
  }

  return modifiedAny ? newList : list;
}
