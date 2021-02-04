import { ApolloInventoryItem, ApolloCar } from './inventory-items';

/** Interface for apollo player inventory. */
export interface ApolloPlayerInventory {
  xuid: bigint;
  giftReason: string;
  credits: bigint;
  cars: ApolloCar[];
  mods: ApolloInventoryItem[];
  vanityItems: ApolloInventoryItem[];
  packs: ApolloInventoryItem[];
  badges: ApolloInventoryItem[];
}
