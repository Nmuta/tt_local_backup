/** Interface for apollo player inventory item. */
export interface ApolloInventoryItem {
  itemId: BigInt;
  quantity: BigInt;
  acquisitionUtc: Date;
  lastUsedUtc: Date;
  description: string;
  special: 'Unicorn' | ''; // may be other values
}
