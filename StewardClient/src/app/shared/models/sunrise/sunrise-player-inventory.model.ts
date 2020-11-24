import { SunriseInventoryItem, SunriseCar } from './inventory-items';

/** Interface for sunrise player inventory. */
export interface SunrisePlayerInventory {
  xuid?: BigInt;
  credits?: number;
  wheelSpins?: number;
  superWheelSpins?: number;
  skillPoints?: number;
  forzathonPoints?: number;
  cars?: SunriseCar[];
  rebuilds?: SunriseInventoryItem[];
  vanityItems?: SunriseInventoryItem[];
  carHorns?: SunriseInventoryItem[];
  quickChatLines?: SunriseInventoryItem[];
  creditRewards?: SunriseInventoryItem[];
  emotes?: SunriseInventoryItem[];
  barnFindRumors?: SunriseInventoryItem[];
  perks?: SunriseInventoryItem[];
  giftReason?: string;
}
