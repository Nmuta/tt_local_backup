import BigNumber from 'bignumber.js';
import { ZERO } from '@helpers/bignumbers';
import faker from '@faker-js/faker';
interface FakeBigNumberParams {
  min: BigNumber | number;
  max?: BigNumber | number;
}

/** Generate a fake BigNumber that is at least as large as MAX_SAFE_INTEGER by default. */
export function fakeBigNumber(
  params: FakeBigNumberParams = { min: Number.MAX_SAFE_INTEGER },
): BigNumber {
  try {
    const min = new BigNumber(params.min ?? 0);
    const max = params.max ? new BigNumber(params.max) : undefined;
    let result = min;

    if (max) {
      // setup
      const ACCUMULATOR_STEP_NUMBER = Number.MAX_SAFE_INTEGER;
      const ACCUMULATOR_STEP_BIGINT = new BigNumber(ACCUMULATOR_STEP_NUMBER);
      let difference = max.minus(min);

      // validation
      if (difference < ZERO) {
        throw new Error(`Max must be greater than min. ${min} > ${max}`);
      }

      // handle large differences
      while (difference > ACCUMULATOR_STEP_BIGINT) {
        result = result.plus(new BigNumber(faker.datatype.number(ACCUMULATOR_STEP_NUMBER)));
        difference = difference.minus(ACCUMULATOR_STEP_BIGINT);
      }

      // handle any remaining difference
      result = result.plus(new BigNumber(faker.datatype.number(Number(difference))));
    } else {
      // no max was specified, so anything is fine as long as it's too big to fit into a regular Number
      result = result.plus(new BigNumber(faker.datatype.number()));
    }

    return result;
  } catch (ex) {
    throw new Error('Error encountered while generating a fake BigNumber');
  }
}
