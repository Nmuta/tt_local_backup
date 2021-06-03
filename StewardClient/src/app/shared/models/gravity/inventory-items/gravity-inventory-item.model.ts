import BigNumber from 'bignumber.js';
/** Interface for gravity player inventory item. */
export interface GravityInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: DateTime;
  modifiedUtc: DateTime;
  lastUsedUtc: DateTime;
  description: string;
}
