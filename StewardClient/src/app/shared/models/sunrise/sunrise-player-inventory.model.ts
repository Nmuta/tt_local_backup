import BigNumber from 'bignumber.js';
import { SunriseInventoryItem, SunriseCar } from './inventory-items';

/** Interface for sunrise player inventory. */
export interface SunrisePlayerInventory {
  xuid: BigNumber;
  credits: BigNumber;
  wheelSpins: BigNumber;
  superWheelSpins: BigNumber;
  skillPoints: BigNumber;
  forzathonPoints: BigNumber;
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
