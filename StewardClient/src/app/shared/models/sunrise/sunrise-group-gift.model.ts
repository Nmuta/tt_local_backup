import { GroupGift } from '@models/gift';
import { SunriseMasterInventory } from './sunrise-master-inventory.model';

/** Interface for a Sunrise group gift. */
export interface SunriseGroupGift extends GroupGift {
  inventory: SunriseMasterInventory;
}
