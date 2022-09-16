import { BigNumber } from 'bignumber.js';
import { MonoTypeOperatorFunction, Observable, startWith, pairwise, filter, map } from 'rxjs';

type EqualsPredicate<T> = (prev: T | null, cur: T) => boolean;
const DefaultEqualsPredicate: EqualsPredicate<unknown> = (prev, cur) => prev === cur;

/** Given an equivalence predicate, only passes thru values that are not the same as the immediate previous value. */
export function pairwiseSkip<T>(equalsPredicate?: EqualsPredicate<T>): MonoTypeOperatorFunction<T> {
  equalsPredicate = equalsPredicate ?? DefaultEqualsPredicate;

  return (x: Observable<T>) => {
    return x.pipe(
      startWith(null),
      pairwise(),
      filter(([prev, cur]) => !equalsPredicate(prev, cur)),
      map(([_prev, cur]) => cur),
    );
  };
}

/** A collection of standard predicates for use with {@link pairwiseSkip} */
export class PairwiseSkipPredicates {
  /**
   * Compares bignumbers without knowing that you even have an object.
   *
   * Bignumbers match: true
   * Bignumbers don't match: false
   * Neither are bignumbers: true
   * Only B is bignumber: false
   */
  public static bigNumber(a: BigNumber | null, b: BigNumber | null): boolean {
    const aIsBigNumber = BigNumber.isBigNumber(a);
    const bIsBigNumber = BigNumber.isBigNumber(b);

    // Must check both, because new BigNumber(5).isEqualTo(5) == true
    if (aIsBigNumber && bIsBigNumber) {
      return a.isEqualTo(b);
    }

    // if neither are big numbers, we do not care if the value changed. they are equally not big numbers
    if (!aIsBigNumber && !bIsBigNumber) {
      return true;
    }

    // one is a BigNumber and the other is not, so we care about the change
    return false;
  }
}
