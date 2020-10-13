import { GravityInventoryItem, GravityCar } from "./inventory-items";

/** Interface for gravity player inventory. */
export interface GravityPlayerInventory {
  xuid?: any;
  turn10Id?: string;
  cars?: GravityCar[];
  masteryKits?: GravityInventoryItem[];
  upgradeKits?: GravityUpgradeKit[];
  repairKits?: GravityRepairKit[];
  packs?: GravityInventoryItem[];
  currencies?: GravityInventoryItem[];
  energyRefills?: GravityInventoryItem[];
  previousGameSettingsId?: any;
  currentExternalProfileId?: any;
}
