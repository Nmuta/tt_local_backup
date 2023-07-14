import { ExtractedStringArrays } from './extracted-model';
import { collectType } from './collect-type';
import { isArray, isString } from 'lodash';

/** Extracts string arrays from the given object. */
export function extractStringArrays(source: unknown): ExtractedStringArrays {
  if (!source) {
    return undefined;
  }
  const output: ExtractedStringArrays = { all: [] };
  output.all = collectType<string[]>(source, v => isArray(v) && v.every(v2 => isString(v2)));
  return output;
}
