import { Gift } from '@models/gift';
import { WoodstockMasterInventory } from './woodstock-master-inventory.model';

/** Interface for Woodstock gift. */
export interface WoodstockGift extends Gift {
  inventory: WoodstockMasterInventory;
}
