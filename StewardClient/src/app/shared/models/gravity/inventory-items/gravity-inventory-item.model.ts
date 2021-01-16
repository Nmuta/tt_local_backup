/** Interface for gravity player inventory item. */
export interface GravityInventoryItem {
  itemId: number;
  quantity: unknown;
  acquisitionUtc: unknown;
  modifiedUtc: unknown;
  lastUsedUtc: unknown;
  description: string;
}
