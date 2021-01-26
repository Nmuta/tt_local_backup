import { GravityCar, GravityInventoryItem, GravityKit } from './inventory-items';

/** Interface for gravity player inventory. */
export interface GravityPlayerInventory {
  xuid: BigInt;
  t10Id: string;
  previousGameSettingsId: string;
  currentExternalProfileId: unknown;
  cars: GravityCar[];
  masteryKits: GravityInventoryItem[];
  upgradeKits: GravityKit[];
  repairKits: GravityKit[];
  packs: GravityInventoryItem[];
  currencies: GravityInventoryItem[];
  energyRefills: GravityInventoryItem[];
}
