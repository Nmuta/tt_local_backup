import { fakeBigInt } from './fake-bigint';

/** Generate a fake xuid. */
export function fakeXuid(): bigint {
  return fakeBigInt({ min: Number.MAX_SAFE_INTEGER });
}
