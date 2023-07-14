import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for Steelhead base inventory. */
export interface SteelheadBaseInventory<
  TItem extends MasterInventoryItem,
  TCar extends MasterInventoryItem,
> {
  creditRewards: TItem[];
  cars: TCar[];
  vanityItems: TItem[];
}
