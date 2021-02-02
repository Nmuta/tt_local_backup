/** Interface for apollo player inventory item. */
export interface ApolloInventoryItem {
  itemId: BigInt;
  quantity: BigInt;
  acquisitionUtc: unknown;

  lastUsedUtc: unknown;
  description: string;
  special: string;
}
