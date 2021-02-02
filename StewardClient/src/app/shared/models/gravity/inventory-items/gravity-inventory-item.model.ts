/** Interface for gravity player inventory item. */
export interface GravityInventoryItem {
  itemId: BigInt;
  quantity: unknown;
  acquisitionUtc: unknown;
  modifiedUtc: unknown;
  lastUsedUtc: unknown;
  description: string;
}
