/** Interface for sunrise player inventory item. */
export interface SunriseInventoryItem {
  itemId: BigInt;
  quantity: BigInt;
  acquisitionUtc: Date;
  modifiedUtc: Date;
  lastUsedUtc: Date;
  description: string;
}
