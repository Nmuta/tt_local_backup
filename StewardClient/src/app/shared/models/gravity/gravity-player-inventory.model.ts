import { GuidLikeString, T10IdString } from '@models/extended-types';
import { GravityCar, GravityInventoryItem, GravityKit } from './inventory-items';

/** Interface for gravity player inventory. */
export interface GravityPlayerInventory {
  xuid: bigint;
  t10Id: T10IdString;
  previousGameSettingsId: GuidLikeString;
  currentExternalProfileId: GuidLikeString;
  cars: GravityCar[];
  masteryKits: GravityInventoryItem[];
  upgradeKits: GravityKit[];
  repairKits: GravityKit[];
  packs: GravityInventoryItem[];
  currencies: GravityInventoryItem[];
  energyRefills: GravityInventoryItem[];
}
