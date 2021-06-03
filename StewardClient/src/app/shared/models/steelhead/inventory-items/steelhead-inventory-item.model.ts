import BigNumber from 'bignumber.js';
/** Interface for Steelhead player inventory item. */
export interface SteelheadInventoryItem {
  itemId: BigNumber;
  quantity: BigNumber;
  acquisitionUtc: DateTime;
  lastUsedUtc: DateTime;
  description: string;
  special: 'Unicorn' | ''; // may be other values
}
