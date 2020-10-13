import { GravityCar, GravityInventoryItem, GravityKit } from './inventory-items';

/** Interface for gravity player inventory. */
export interface GravityPlayerInventory {
  xuid?: any;
  turn10Id?: string;
  cars?: GravityCar[];
  masteryKits?: GravityInventoryItem[];
  upgradeKits?: GravityKit[];
  repairKits?: GravityKit[];
  packs?: GravityInventoryItem[];
  currencies?: GravityInventoryItem[];
  energyRefills?: GravityInventoryItem[];
  previousGameSettingsId?: any;
  currentExternalProfileId?: any;
}
