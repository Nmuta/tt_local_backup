import BigNumber from 'bignumber.js';
/** Interface for gravity player inventory item. */
export interface GravityInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: Date;
  modifiedUtc: Date;
  lastUsedUtc: Date;
  description: string;
}
