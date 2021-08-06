import BigNumber from 'bignumber.js';

/** Interface for a Kusto car. */
export interface KustoCar {
  id: BigNumber;
  makeId: BigNumber;
  make: string;
  model: string;

  // Client only property that is used to to define a car make only and ignore model properties.
  makeOnly: boolean;
}
