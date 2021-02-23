import { SunriseMasterInventory } from './sunrise-master-inventory.model';

/** Interface for Sunrise gift. */
export interface SunriseGift {
  giftReason: string;
  inventory: SunriseMasterInventory;
}
