import { PlayerInventoryItem, WoodstockInventoryItemSource } from '@models/player-inventory-item';
import { WoodstockBaseInventory } from './woodstock-base-inventory.model';

export type WoodstockPlayerInventoryItem = PlayerInventoryItem & {
  inventoryItemSource: WoodstockInventoryItemSource;
};

/** Type for woodstock player inventory. */
export type WoodstockPlayerInventory = WoodstockBaseInventory<WoodstockPlayerInventoryItem>;
