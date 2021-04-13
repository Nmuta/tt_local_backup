import * as JSONBigInternal from 'json-bigint';

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
