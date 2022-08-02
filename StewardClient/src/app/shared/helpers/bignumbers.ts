import BigNumber from 'bignumber.js';
import { chain } from 'lodash';

export const NEGATIVE_ONE = new BigNumber(-1);
export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

/** Tries to parse value into BigNumber, returns null if NaN. */
export function tryParseBigNumber(value: BigNumber | number | string): BigNumber {
  if (!(value instanceof BigNumber)) {
    value = new BigNumber(value);
  }

  return !value.isNaN() ? value : null;
}

/** Parse a list of BigNumbers as a string into a list of BigNumber. Separator are \n \r and , */
export function tryParseBigNumbers(value: string): BigNumber[] {
  const inputSplit = value.split(/[,\n\r]/); // split on anything we consider a separator
  const uniqGoodBigNumbers = chain(inputSplit) // start a lodash chain
    .map(v => v.trim()) // get rid of surrounding white space
    .compact() // drop falsy values (empty strings) to save on parse time
    .uniq() // drop dupes now so we dodge string manipulation later
    .map(v => tryParseBigNumber(v)) // parser function which parses the value or produces null if it wasn't parsable to a BigNumber
    .compact() // drop falsy values ("numbers" we could not parse)
    .value();

  return uniqGoodBigNumbers;
}
