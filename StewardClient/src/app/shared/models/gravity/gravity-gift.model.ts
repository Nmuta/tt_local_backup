import { Gift } from '@models/gift';
import { GravityMasterInventory } from './gravity-master-inventory.model';

/** Interface for an Gravity gift. */
export interface GravityGift extends Gift {
  inventory: GravityMasterInventory;
}
