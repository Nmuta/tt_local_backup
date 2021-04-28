import BigNumber from 'bignumber.js';

/** Represents a Kusto function. */
export interface KustoFunction {
  name: string;
  useSplitting: boolean;
  useEndDate: boolean;
  numberOfBuckets: BigNumber | null;
}
