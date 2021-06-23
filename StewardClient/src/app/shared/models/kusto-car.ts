import BigNumber from 'bignumber.js';

/** Interface for a Kusto car. */
export interface KustoCar {
  id: BigNumber;
  makeId: BigNumber;
  make: string;
  model: string;
}
