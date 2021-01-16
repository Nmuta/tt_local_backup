import { GravityGameSettingsItem } from './inventory-items/gravity-game-settings-item.model';

/** Interface for gravity master inventory. */
export interface GravityMasterInventory {
  currencies: GravityGameSettingsItem[];
  repairKits: GravityGameSettingsItem[];
  masteryKits: GravityGameSettingsItem[];
  upgradeKits: GravityGameSettingsItem[];
  cars: GravityGameSettingsItem[];
  energyRefills: GravityGameSettingsItem[];
}
