import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for Gravity master inventory. */
export interface GravityMasterInventory {
  creditRewards: MasterInventoryItem[];
  cars: MasterInventoryItem[];
  repairKits: MasterInventoryItem[];
  masteryKits: MasterInventoryItem[];
  upgradeKits: MasterInventoryItem[];
  energyRefills: MasterInventoryItem[];
}
