/** Interface for apollo player inventory item. */
export interface ApolloInventoryItem {
  itemId: bigint;
  quantity: bigint;
  acquisitionUtc: Date;
  lastUsedUtc: Date;
  description: string;
  special: 'Unicorn' | ''; // may be other values
}
