import { isUndefined } from 'lodash';

/**
 * Returns the first non-undefined value from resultSelector, as seen by walking up the chain through parentSelector.
 * @param {any} input The first object to check.
 * @param {any} parentSelector How to walk up the chain. Stops when it finds an undefined value.
 * @param {any} resultSelector How to choose the object. Stops when it finds a non-undefined value.
 */
export function firstFromParent<T, R>(
  input: T,
  parentSelector: (input: T) => T,
  resultSelector: (input: T) => R,
): R | undefined {
  const result = resultSelector(input);
  if (!isUndefined(result)) {
    return result;
  }

  const parent = parentSelector(input);
  if (!isUndefined(parent)) {
    return firstFromParent(parent, parentSelector, resultSelector);
  }

  return undefined;
}
