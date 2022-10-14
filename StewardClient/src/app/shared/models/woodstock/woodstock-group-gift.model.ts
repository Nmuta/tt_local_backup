import { ExpirableGroupGift } from '@models/gift';
import { WoodstockMasterInventory } from './woodstock-master-inventory.model';

/** Interface for an Apollo group gift. */
export interface WoodstockGroupGift extends ExpirableGroupGift {
  inventory: WoodstockMasterInventory;
}
