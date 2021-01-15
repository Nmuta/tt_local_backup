import { GravityMasterInventory } from './gravity-master-inventory.model';

/** Interface for gravity master inventory lists. */
export interface GravityMasterInventoryLists {
  [gameSettingsId: string]: GravityMasterInventory;
}
