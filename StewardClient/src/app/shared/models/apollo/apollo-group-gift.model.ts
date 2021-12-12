import { GroupGift } from '@models/gift';
import { ApolloMasterInventory } from './apollo-master-inventory.model';

/** Interface for an Apollo group gift. */
export interface ApolloGroupGift extends GroupGift {
  inventory: ApolloMasterInventory;
}
