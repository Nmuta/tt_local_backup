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
  output.ids = output.all.filter(v => v.key.toLowerCase().endsWith('id'));
  output.base64 = output.all.filter(v => v.key.toLowerCase().includes('base64'));
  output.other = output.all.filter(
    v => !v.key.toLowerCase().endsWith('id') && !v.key.toLowerCase().includes('base64'),
  );
  return output;
}
