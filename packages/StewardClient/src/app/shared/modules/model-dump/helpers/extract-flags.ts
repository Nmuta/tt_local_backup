import { humanize } from '@shared/pipes/humanize.pipe';
import { chain, isBoolean } from 'lodash';
import { ExtractedObjectFlags, ObjectEntry } from './extracted-model';

/** Extracts flags from the given object. */
export function extractFlags(source: unknown): ExtractedObjectFlags {
  if (!source) {
    return undefined;
  }
  const output: ExtractedObjectFlags = { is: [], isNot: [], was: [], wasNot: [], all: [] };
  const booleanKeys = chain(source)
    .toPairs()
    .filter(([_key, value]) => isBoolean(value))
    .map(([key, _value]) => key);
  const sortedBooleanKeys = booleanKeys.orderBy().value();

  for (const key of sortedBooleanKeys) {
    const name = humanize(key);
    let shortName = key;
    if (key.startsWith('is')) {
      shortName = humanize(key.substring('is'.length));
    }
    if (key.startsWith('was')) {
      shortName = humanize(key.substring('was'.length));
    }
    output.all.push(<ObjectEntry<boolean>>{ key, name, shortName, value: source[key] });
  }

  for (const flag of output.all) {
    let targetArray = [];
    if (flag.key.startsWith('is')) {
      targetArray = flag.value ? output.is : output.isNot;
    }
    if (flag.key.startsWith('was')) {
      targetArray = flag.value ? output.was : output.wasNot;
    }

    targetArray.push(flag);
  }

  return output;
}
