import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for Gravity base inventory. */
export interface GravityBaseInventory<T extends MasterInventoryItem> {
  creditRewards: T[];
  cars: T[];
  repairKits: T[];
  masteryKits: T[];
  upgradeKits: T[];
  energyRefills: T[];
}
