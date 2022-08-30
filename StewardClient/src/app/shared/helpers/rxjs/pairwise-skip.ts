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
