import { SunriseInventoryItem, SunriseCar } from './inventory-items';

/** Interface for sunrise player inventory. */
export interface SunrisePlayerInventory {
  xuid: BigInt;
  credits: BigInt;
  wheelSpins: BigInt;
  superWheelSpins: BigInt;
  skillPoints: BigInt;
  forzathonPoints: BigInt;
  cars: SunriseCar[];
  rebuilds: SunriseInventoryItem[];
  vanityItems: SunriseInventoryItem[];
  carHorns: SunriseInventoryItem[];
  quickChatLines: SunriseInventoryItem[];
  creditRewards: SunriseInventoryItem[];
  emotes: SunriseInventoryItem[];
  barnFindRumors: SunriseInventoryItem[];
  perks: SunriseInventoryItem[];
  giftReason: string;
}
