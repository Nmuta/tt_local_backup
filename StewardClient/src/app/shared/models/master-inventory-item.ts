/** Interface for a master inventory item. */
export interface MasterInventoryItem {
  id: BigInt;
  description: string;
  quantity: number;
  itemType: string;
}
