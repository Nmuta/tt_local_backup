import BigNumber from 'bignumber.js';

/** Represents a Kusto function. */
export interface KustoFunction {
  name: string;
  /** When true, the API will append yourFunction(parameters, to, the, function). By default this is `datetime('{StartDate:o}')`. */
  makeFunctionCall: boolean;
  /** When true, the API will also append `datetime('{EndDate:o}')` to your function call.*/
  useEndDate: boolean;
  /** When true, the API will also append `{NumBuckets}, {Bucket}` to your function call.*/
  useSplitting: boolean;
  /** When provided, the API will use this for the number of buckets. */
  numberOfBuckets?: BigNumber;
}
