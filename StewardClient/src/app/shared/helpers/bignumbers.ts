import BigNumber from 'bignumber.js';

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
