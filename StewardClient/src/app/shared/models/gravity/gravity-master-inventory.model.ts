import { MasterInventoryItem } from '@models/master-inventory-item';
import { GravityBaseInventory } from './gravity-base-inventory.model';

/** Type for Gravity master inventory. */
export type GravityMasterInventory = GravityBaseInventory<MasterInventoryItem>;
