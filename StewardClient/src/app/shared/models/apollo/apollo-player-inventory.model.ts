import { ApolloInventoryItem, ApolloCar } from './inventory-items';

/** Interface for apollo player inventory. */
export interface ApolloPlayerInventory {
  xuid: BigInt;
  giftReason: string;
  credits: BigInt;
  cars: ApolloCar[];
  mods: ApolloInventoryItem[];
  vanityItems: ApolloInventoryItem[];
  packs: ApolloInventoryItem[];
  badges: ApolloInventoryItem[];
}
