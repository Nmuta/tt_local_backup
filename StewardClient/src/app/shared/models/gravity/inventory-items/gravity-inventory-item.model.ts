/** Interface for gravity player inventory item. */
export interface GravityInventoryItem {
  itemId: BigInt;
  quantity: BigInt;
  acquisitionUtc: Date;
  modifiedUtc: Date;
  lastUsedUtc: Date;
  description: string;
}
