import * as faker from 'faker';

interface FakeBigIntParams {
  min: BigInt | number;
  max?: BigInt | number;
}

/** Generate a fake BigInt that is at least as large as MAX_SAFE_INTEGER by default. */
export function fakeBigInt(params: FakeBigIntParams = { min: Number.MAX_SAFE_INTEGER }): BigInt {
  const min = BigInt(params.min ?? 0);
  const max = BigInt(params.max ?? undefined);

  let result = min;

  if (max) {
    const ACCUMULATOR_STEP_NUMBER = Number.MAX_SAFE_INTEGER;
    const ACCUMULATOR_STEP_BIGINT = BigInt(ACCUMULATOR_STEP_NUMBER);
    let difference = max - min;

    if (difference < 0) {
      throw new Error(`Max must be greater than min. ${min} > ${max}`);
    }

    do {
      result = result + BigInt(faker.random.number(ACCUMULATOR_STEP_NUMBER));
      difference = difference - ACCUMULATOR_STEP_BIGINT;
    } while (difference > ACCUMULATOR_STEP_BIGINT);

    result = result + BigInt(faker.random.number(Number(difference)));
  } else {
    result = result + BigInt(faker.random.number());
  }

  return result;
}
