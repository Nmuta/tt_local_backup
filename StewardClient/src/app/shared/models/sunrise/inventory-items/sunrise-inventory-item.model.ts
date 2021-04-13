import BigNumber from 'bignumber.js';
/** Interface for sunrise player inventory item. */
export interface SunriseInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: Date;
  modifiedUtc: Date;
  lastUsedUtc: Date;
  description: string;
}
