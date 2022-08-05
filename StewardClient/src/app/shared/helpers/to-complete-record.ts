import { chain, uniq } from 'lodash';

/** Produces a complete Record object given a list of all possible keys, and a list of "true" keys. */
export function toCompleteLookup(allKeys: string[], setKeys: string[]): Record<string, boolean> {
  // TODO: We should be able to improve the typings above to allow passing in a string-enum for sourcing the keys, and provide typesafe output
  setKeys = setKeys ?? [];

  const allKeysLookup = new Set(allKeys);
  const setKeysHasUnknownValue = !setKeys.every(k => allKeysLookup.has(k));
  if (setKeysHasUnknownValue) {
    throw new Error('SetKeys list has values not present in AllKeys list.');
  }

  const setKeysLookup = new Set(uniq(setKeys));
  const record = chain(allKeys).map(k => ([k, setKeysLookup.has(k)])).fromPairs().value();
  return record;
}