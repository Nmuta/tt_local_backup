import BigNumber from 'bignumber.js';
/** Interface for woodstock player inventory item. */
export interface WoodstockInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: DateTime;
  modifiedUtc: DateTime;
  lastUsedUtc: DateTime;
  description: string;
}
