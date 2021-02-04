/** Interface for sunrise player inventory item. */
export interface SunriseInventoryItem {
  itemId: bigint;
  quantity: bigint;
  acquisitionUtc: Date;
  modifiedUtc: Date;
  lastUsedUtc: Date;
  description: string;
}
