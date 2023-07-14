import { map } from 'lodash';

/** Returns a new array with the first occurence of `oldValue` replaced by `newValue`. */
export function replace<T>(array: T[], oldValue: T, newValue: T): T[] {
  let isFirst = true;

  return map(array, v => {
    if (isFirst && v === oldValue) {
      isFirst = false;
      return newValue;
    } else {
      return v;
    }
  });
}
