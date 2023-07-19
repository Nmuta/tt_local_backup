import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for woodstock base inventory. */
export interface WoodstockBaseInventory<T extends MasterInventoryItem> {
  creditRewards: T[];
  cars: T[];
  carHorns: T[];
  vanityItems: T[];
  quickChatLines: T[];
  emotes: T[];
}
