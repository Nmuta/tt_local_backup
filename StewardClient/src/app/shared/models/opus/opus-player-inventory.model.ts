import { OpusCar } from './inventory-items';

/** Interface for opus player inventory. */
export interface OpusPlayerInventory {
  credits: BigInt;
  cars: OpusCar[];
}
