import { Gift } from '@models/gift';
import { ApolloMasterInventory } from './apollo-master-inventory.model';

/** Interface for an Apollo gift. */
export interface ApolloGift extends Gift {
  inventory: ApolloMasterInventory;
}
