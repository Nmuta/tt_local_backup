import BigNumber from 'bignumber.js';
import { ZERO } from '@helpers/bignumbers';
import * as faker from 'faker';
interface FakeBigNumberParams {
  min: BigNumber | number;
  max?: BigNumber | number;
}

/** Generate a fake BigNumber that is at least as large as MAX_SAFE_INTEGER by default. */
export function fakeBigNumber(
  params: FakeBigNumberParams = { min: Number.MAX_SAFE_INTEGER },
): BigNumber {
  const min = new BigNumber(params.min ?? 0);
  const max = params.max ? new BigNumber(params.max) : undefined;
  let result = min;

  if (max) {
    const ACCUMULATOR_STEP_NUMBER = Number.MAX_SAFE_INTEGER;
    const ACCUMULATOR_STEP_BIGINT = new BigNumber(ACCUMULATOR_STEP_NUMBER);
    let difference = max.minus(min);

    if (difference < ZERO) {
      throw new Error(`Max must be greater than min. ${min} > ${max}`);
    }

    do {
      result = result.plus(new BigNumber(faker.datatype.number(ACCUMULATOR_STEP_NUMBER)));
      difference = difference.minus(ACCUMULATOR_STEP_BIGINT);
    } while (difference > ACCUMULATOR_STEP_BIGINT);

    result = result.plus(new BigNumber(faker.datatype.number(Number(difference))));
  } else {
    result = result.plus(new BigNumber(faker.datatype.number()));
  }

  return result;
}
