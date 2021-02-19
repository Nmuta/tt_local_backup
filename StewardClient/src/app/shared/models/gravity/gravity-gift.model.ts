import { GravityMasterInventory } from './gravity-master-inventory.model';

/** Interface for Sunrise gift. */
export interface GravityGift {
  giftReason: string;
  inventory: GravityMasterInventory;
}
