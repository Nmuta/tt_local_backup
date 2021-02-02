/** Interface for sunrise player inventory item. */
export interface SunriseInventoryItem {
  itemId: BigInt;
  quantity: unknown;
  acquisitionUtc: unknown;
  modifiedUtc: unknown;
  lastUsedUtc: unknown;
  description: string;
}
