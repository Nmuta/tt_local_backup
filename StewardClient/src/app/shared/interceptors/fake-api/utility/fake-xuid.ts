import BigNumber from 'bignumber.js';
import { fakeBigNumber } from './fake-bigint';

/** Generate a fake xuid. */
export function fakeXuid(): BigNumber {
  return fakeBigNumber({ min: Number.MAX_SAFE_INTEGER });
}
