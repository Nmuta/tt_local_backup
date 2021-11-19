import { ExtractedObjectStrings } from './extracted-model';
import { collectType } from './collect-type';
import { isString } from 'lodash';

/** Extracts strings from the given object. */
export function extractStrings(source: unknown): ExtractedObjectStrings {
  if (!source) {
    return undefined;
  }
  const output: ExtractedObjectStrings = { all: [] };
  output.all = collectType<string>(source, v => isString(v));
  output.ids = output.all.filter(v => v.key.endsWith('Id'));
  output.other = output.all.filter(v => !v.key.endsWith('Id'));
  return output;
}
