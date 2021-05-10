import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for woodstock master inventory. */
export interface WoodstockMasterInventory {
  creditRewards: MasterInventoryItem[];
  cars: MasterInventoryItem[];
  carHorns: MasterInventoryItem[];
  vanityItems: MasterInventoryItem[];
  quickChatLines: MasterInventoryItem[];
  emotes: MasterInventoryItem[];
}
