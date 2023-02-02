import { SimpleChange } from '@angular/core';

/** A version of {@see SimpleChanges} which respects typings. */
export type BetterSimpleChanges<T1> = {
  [P in keyof T1]: BetterSimpleChange<T1[P]>
};

/** A version of {@see SimpleChange} which respects typings. */
export interface BetterSimpleChange<T2> extends SimpleChange {
  previousValue: T2;
  currentValue: T2;
}