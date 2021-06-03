import BigNumber from 'bignumber.js';
/** Interface for apollo player inventory item. */
export interface ApolloInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: DateTime;
  lastUsedUtc: DateTime;
  description: string;
  special: 'Unicorn' | ''; // may be other values
}
