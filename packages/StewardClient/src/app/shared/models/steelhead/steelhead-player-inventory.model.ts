import { PlayerInventoryCarItem, PlayerInventoryItem } from '@models/player-inventory-item';
import { SteelheadBaseInventory } from './steelhead-base-inventory.model';

/** Type for Steelhead player inventory. */
export type SteelheadPlayerInventory = SteelheadBaseInventory<
  PlayerInventoryItem,
  PlayerInventoryCarItem
>;

export const EMPTY_STEELHEAD_PLAYER_INVENTORY: SteelheadPlayerInventory = {
  creditRewards: [],
  cars: [],
  vanityItems: [],
  driverSuits: [],
};
