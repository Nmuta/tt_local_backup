import { GravityGameSettingsItem } from './inventory-items/gravity-game-settings-item.model';

/** Interface for gravity master inventory. */
export interface GravityMasterInventory {
  cars: GravityGameSettingsItem[];
  currencies: GravityGameSettingsItem[];
  repairKits: GravityGameSettingsItem[];
  masteryKits: GravityGameSettingsItem[];
  upgradeKits: GravityGameSettingsItem[];
  energyRefills: GravityGameSettingsItem[];
}
