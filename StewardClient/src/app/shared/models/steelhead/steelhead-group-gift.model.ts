import { GroupGift } from '@models/gift';
import { SteelheadMasterInventory } from './steelhead-master-inventory.model';

/** Interface for an Steelhead group gift. */
export interface SteelheadGroupGift extends GroupGift {
  inventory: SteelheadMasterInventory;
}
