/** Interface for apollo player inventory item. */
export interface ApolloInventoryItem {
  itemId: number;
  quantity: number;
  acquisitionUtc: unknown;
  lastUsedUtc: unknown;
  description: string;
  special: string;
}
