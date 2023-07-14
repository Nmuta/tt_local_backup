import { MasterInventoryItem } from '@models/master-inventory-item';
import { WoodstockBaseInventory } from './woodstock-base-inventory.model';

/** Type for woodstock master inventory. */
export type WoodstockMasterInventory = WoodstockBaseInventory<MasterInventoryItem>;
