import { keys } from 'lodash';

/** Returns true if the provided key is the only entry in source that evaluates truthy. */
export function onlyTrueKey<T1>(source: T1, trueKey: keyof T1): boolean {
  if (!source[trueKey]) {
    return false;
  }

  for (const key of keys(source)) {
    if (key == trueKey) {
      continue;
    }

    if (!!source[key]) {
      return false;
    }
  }

  return true;
}

/** Returns true if the provided key is the only entry in source that evaluates truthy after evaluation. */
export function onlyTrueKeyBy<T1>(
  source: T1,
  trueKey: keyof T1,
  evaluator: (input: T1[keyof T1]) => boolean,
): boolean {
  if (!evaluator(source[trueKey])) {
    return false;
  }

  for (const key of keys(source)) {
    if (key == trueKey) {
      continue;
    }

    if (evaluator(source[key])) {
      return false;
    }
  }

  return true;
}
