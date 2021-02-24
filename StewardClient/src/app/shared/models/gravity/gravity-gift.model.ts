import { GravityMasterInventory } from './gravity-master-inventory.model';

/** Interface for an Gravity gift. */
export interface GravityGift {
  giftReason: string;
  inventory: GravityMasterInventory;
}
