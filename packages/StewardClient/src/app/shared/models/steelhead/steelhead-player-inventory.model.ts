import { SteelheadPlayerInventoryCarItem, PlayerInventoryItem, SteelheadInventoryItemSource } from '@models/player-inventory-item';
import { SteelheadBaseInventory } from './steelhead-base-inventory.model';

export type SteelheadPlayerInventoryItem = PlayerInventoryItem & {
  inventoryItemSource: SteelheadInventoryItemSource;
}

/** Type for Steelhead player inventory. */
export type SteelheadPlayerInventory = SteelheadBaseInventory<
  SteelheadPlayerInventoryItem,
  SteelheadPlayerInventoryCarItem
>;

export const EMPTY_STEELHEAD_PLAYER_INVENTORY: SteelheadPlayerInventory = {
  creditRewards: [],
  cars: [],
  vanityItems: [],
  driverSuits: [],
};
