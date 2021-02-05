/** Interface for gravity player inventory item. */
export interface GravityInventoryItem {
  itemId: bigint;
  quantity: bigint;
  acquisitionUtc: Date;
  modifiedUtc: Date;
  lastUsedUtc: Date;
  description: string;
}
