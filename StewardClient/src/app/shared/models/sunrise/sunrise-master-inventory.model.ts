import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for sunrise master inventory. */
export interface SunriseMasterInventory {
  creditRewards: MasterInventoryItem[];
  cars: MasterInventoryItem[];
  carHorns: MasterInventoryItem[];
  vanityItems: MasterInventoryItem[];
  quickChatLines: MasterInventoryItem[];
  emotes: MasterInventoryItem[];
}
