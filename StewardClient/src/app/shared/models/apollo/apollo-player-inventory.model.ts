import { PlayerInventoryItem } from '@models/player-inventory-item';
import { ApolloBaseInventory } from './apollo-base-inventory.model';

/** Type for apollo player inventory. */
export type ApolloPlayerInventory = ApolloBaseInventory<PlayerInventoryItem>;
