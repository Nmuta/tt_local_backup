import { GroupGift } from '@models/gift';
import { WoodstockMasterInventory } from './woodstock-master-inventory.model';

/** Interface for an Apollo group gift. */
export interface WoodstockGroupGift extends GroupGift {
  inventory: WoodstockMasterInventory;
}
