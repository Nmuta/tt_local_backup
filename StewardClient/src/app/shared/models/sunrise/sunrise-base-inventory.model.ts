import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for sunrise base inventory. */
export interface SunriseBaseInventory<T extends MasterInventoryItem> {
  creditRewards: T[];
  cars: T[];
  carHorns: T[];
  vanityItems: T[];
  quickChatLines: T[];
  emotes: T[];
}
