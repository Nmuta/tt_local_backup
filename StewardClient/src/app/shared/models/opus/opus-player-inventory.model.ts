import BigNumber from 'bignumber.js';
import { OpusCar } from './inventory-items';

/** Interface for opus player inventory. */
export interface OpusPlayerInventory {
  credits: BigNumber;
  cars: OpusCar[];
}
