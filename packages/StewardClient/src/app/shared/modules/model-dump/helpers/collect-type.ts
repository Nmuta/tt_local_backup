import { humanize } from '@shared/pipes/humanize.pipe';
import { chain } from 'lodash';
import { ObjectEntry } from './extracted-model';

/** Collects key-value pairs of a given type given a typeCheck predicate and an optional valueMapper. */
export function collectType<T>(
  source: unknown,
  typeCheck: (value: unknown) => boolean,
  valueMapper: (value: unknown) => T = v => v as T,
): ObjectEntry<T>[] {
  const output: ObjectEntry<T>[] = [];
  const keys = chain(source)
    .toPairs()
    .filter(([_key, value]) => typeCheck(value))
    .map(([key, _value]) => key);
  const sortedKeys = keys.orderBy().value();
  for (const key of sortedKeys) {
    const name = humanize(key);
    const shortName = name;
    output.push(<ObjectEntry<T>>{ key, name, shortName, value: valueMapper(source[key]) });
  }

  return output;
}
