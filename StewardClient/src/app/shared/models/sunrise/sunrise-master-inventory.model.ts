import { SunriseInventoryItem, SunriseCar } from './inventory-items';

/** Interface for sunrise master inventory. */
export interface SunriseMasterInventory {
  creditRewards: string[];
  cars: SunriseCar[];
  carHorns: SunriseInventoryItem[];
  vanityItems: SunriseInventoryItem[];
  quickChatLines: SunriseInventoryItem[];
  emotes: SunriseInventoryItem[];
}
