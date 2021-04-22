import { SteelheadMasterInventory } from './steelhead-master-inventory.model';

/** Interface for an Steelhead gift. */
export interface SteelheadGift {
  giftReason: string;
  inventory: SteelheadMasterInventory;
}
