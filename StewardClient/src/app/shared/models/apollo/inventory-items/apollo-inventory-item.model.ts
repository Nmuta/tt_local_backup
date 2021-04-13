import BigNumber from 'bignumber.js';
/** Interface for apollo player inventory item. */
export interface ApolloInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: Date;
  lastUsedUtc: Date;
  description: string;
  special: 'Unicorn' | ''; // may be other values
}
