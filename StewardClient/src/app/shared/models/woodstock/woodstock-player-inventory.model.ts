import BigNumber from 'bignumber.js';
import { WoodstockInventoryItem, WoodstockCar } from './inventory-items';

/** Interface for woodstock player inventory. */
export interface WoodstockPlayerInventory {
  xuid: BigNumber;
  credits: BigNumber;
  wheelSpins: BigNumber;
  superWheelSpins: BigNumber;
  skillPoints: BigNumber;
  forzathonPoints: BigNumber;
  cars: WoodstockCar[];
  rebuilds: WoodstockInventoryItem[];
  vanityItems: WoodstockInventoryItem[];
  carHorns: WoodstockInventoryItem[];
  quickChatLines: WoodstockInventoryItem[];
  creditRewards: WoodstockInventoryItem[];
  emotes: WoodstockInventoryItem[];
  barnFindRumors: WoodstockInventoryItem[];
  perks: WoodstockInventoryItem[];
  giftReason: string;
}
