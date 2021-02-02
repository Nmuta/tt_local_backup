/** Interface for apollo player inventory item. */
export interface ApolloInventoryItem {
  itemId: BigInt;
  quantity: BigInt;
  acquisitionUtc: Date;
  modifiedUtc: never; // apollo does not have this value
  lastUsedUtc: Date;
  description: string;
  special: 'Unicorn' | ''; // may be other values
}
