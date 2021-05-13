import { MasterInventoryItem } from '@models/master-inventory-item';
import { SteelheadBaseInventory } from './steelhead-base-inventory.model';

/** Type for Steelhead master inventory. */
export type SteelheadMasterInventory = SteelheadBaseInventory<MasterInventoryItem>;
