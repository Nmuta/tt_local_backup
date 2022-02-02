import * as JSONBigInternal from 'json-bigint';
import { Observable } from 'rxjs';

/**
 * A JSON parser configured to make all numbers into BigInts.
 * See bignumber and bigjson pipes for formatted output.
 */
export const JSONBigInt = JSONBigInternal({
  alwaysParseAsBig: true,

  // we cannot use BigInt because it only supports Integers, and
  // some of our content (like Kusto) returns decimal values.
  // There is not presently a way to configure JSONBigInt to
  // conditionally convert some values.
  // There are some PRs open for it, but they have been sitting for a long time.
  // 2021-04-13
  useNativeBigInt: false,
});

/** Serializes an unknown object into a string, avoiding common pitfalls. */
export function jsonBigIntSafeSerialize(value: unknown, space?: string | number): string {
  const cache = [];
  const removeCircularAndObservable = (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        return '[Circular]';
      }
      cache.push(value);
    }

    if (value instanceof Observable) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return `[Observable (s${(value as any).observers?.length})]`;
    }

    return value;
  };

  return JSONBigInt.stringify(value, removeCircularAndObservable, space);
}
