import * as JSONBigInternal from 'json-bigint';

/**
 * A JSON parser configured to make all numbers into BigInts.
 * See bignumber and bigjson pipes for formatted output.
 */
export const JSONBigInt = JSONBigInternal({
  alwaysParseAsBig: true,
  useNativeBigInt: true,
});
