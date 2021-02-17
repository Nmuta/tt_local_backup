import { ApolloMasterInventory } from './apollo';
import { GravityMasterInventory } from './gravity/gravity-master-inventory.model';
import { SunriseMasterInventory } from './sunrise/sunrise-master-inventory.model';

/** Interface for a master inventory item. */
export interface MasterInventoryItem {
  id: bigint;
  description: string;
  quantity: number;
  itemType: string;
}

export type MasterInventoryUnion =
  | GravityMasterInventory
  | SunriseMasterInventory
  | ApolloMasterInventory;

export type GiftBasketModel = MasterInventoryItem & { edit: boolean; error: string };
