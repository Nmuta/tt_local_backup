import { Gift } from '@models/gift';
import { SteelheadMasterInventory } from './steelhead-master-inventory.model';

/** Interface for an Steelhead gift. */
export interface SteelheadGift extends Gift {
  inventory: SteelheadMasterInventory;
}
