import { SunriseMasterInventory } from './sunrise-master-inventory.model';

/** Interface for an Sunrise gift. */
export interface SunriseGift {
  giftReason: string;
  inventory: SunriseMasterInventory;
}
