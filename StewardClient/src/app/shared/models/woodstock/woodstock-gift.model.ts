import { WoodstockMasterInventory } from './woodstock-master-inventory.model';

/** Interface for Woodstock gift. */
export interface WoodstockGift {
  giftReason: string;
  inventory: WoodstockMasterInventory;
}
