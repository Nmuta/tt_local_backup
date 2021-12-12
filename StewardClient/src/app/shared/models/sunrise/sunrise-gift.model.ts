import { Gift } from '@models/gift';
import { SunriseMasterInventory } from './sunrise-master-inventory.model';

/** Interface for Sunrise gift. */
export interface SunriseGift extends Gift {
  inventory: SunriseMasterInventory;
}
