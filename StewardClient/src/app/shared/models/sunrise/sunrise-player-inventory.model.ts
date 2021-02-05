import { SunriseInventoryItem, SunriseCar } from './inventory-items';

/** Interface for sunrise player inventory. */
export interface SunrisePlayerInventory {
  xuid: bigint;
  credits: bigint;
  wheelSpins: bigint;
  superWheelSpins: bigint;
  skillPoints: bigint;
  forzathonPoints: bigint;
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
