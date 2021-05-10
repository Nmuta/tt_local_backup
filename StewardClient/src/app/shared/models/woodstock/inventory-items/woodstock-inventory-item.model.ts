import BigNumber from 'bignumber.js';
/** Interface for woodstock player inventory item. */
export interface WoodstockInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: Date;
  modifiedUtc: Date;
  lastUsedUtc: Date;
  description: string;
}
