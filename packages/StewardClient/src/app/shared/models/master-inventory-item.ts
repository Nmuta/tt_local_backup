import BigNumber from 'bignumber.js';
import { ApolloMasterInventory } from './apollo';
import { MSError } from './error.model';
import { SunriseMasterInventory } from './sunrise/sunrise-master-inventory.model';

/** Interface for a master inventory item. */
export interface MasterInventoryItem {
  id: BigNumber;
  description: string;
  quantity: number;
  itemType: string;
  error: MSError;
}

export type MasterInventoryUnion = SunriseMasterInventory | ApolloMasterInventory;
