import { MasterInventoryItem } from '@models/master-inventory-item';

/** Interface for Gravity master inventory. */
export interface GravityMasterInventory {
  creditRewards: MasterInventoryItem[];
  cars: MasterInventoryItem[];
  masteryKits: MasterInventoryItem[];
  upgradeKits: MasterInventoryItem[];
  repairKits: MasterInventoryItem[];
  energyRefills: MasterInventoryItem[];
}