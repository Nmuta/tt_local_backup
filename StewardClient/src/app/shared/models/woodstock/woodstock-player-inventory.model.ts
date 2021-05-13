import { PlayerInventoryItem } from '@models/player-inventory-item';
import { WoodstockBaseInventory } from './woodstock-base-inventory.model';

/** Type for woodstock player inventory. */
export type WoodstockPlayerInventory = WoodstockBaseInventory<PlayerInventoryItem>;
