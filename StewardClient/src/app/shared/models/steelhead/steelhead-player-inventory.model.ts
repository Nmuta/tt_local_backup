import BigNumber from 'bignumber.js';
import { SteelheadInventoryItem, SteelheadCar } from './inventory-items';

/** Interface for Steelhead player inventory. */
export interface SteelheadPlayerInventory {
  xuid: BigNumber;
  giftReason: string;
  credits: BigNumber;
  cars: SteelheadCar[];
  mods: SteelheadInventoryItem[];
  vanityItems: SteelheadInventoryItem[];
  packs: SteelheadInventoryItem[];
  badges: SteelheadInventoryItem[];
}
