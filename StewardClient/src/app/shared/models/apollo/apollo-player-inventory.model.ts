import BigNumber from 'bignumber.js';
import { ApolloInventoryItem, ApolloCar } from './inventory-items';

/** Interface for apollo player inventory. */
export interface ApolloPlayerInventory {
  xuid: BigNumber;
  giftReason: string;
  credits: BigNumber;
  cars: ApolloCar[];
  mods: ApolloInventoryItem[];
  vanityItems: ApolloInventoryItem[];
  packs: ApolloInventoryItem[];
  badges: ApolloInventoryItem[];
}
