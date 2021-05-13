import { PlayerInventoryItem } from '@models/player-inventory-item';
import { SteelheadBaseInventory } from './steelhead-base-inventory.model';

/** Type for Steelhead player inventory. */
export type SteelheadPlayerInventory = SteelheadBaseInventory<PlayerInventoryItem>;
