import { tryToDateTime, toDateTime } from '@helpers/luxon';
import { orderBy } from 'lodash';
import { DateTime } from 'luxon';
import { ExtractedObjectDates } from './extracted-model';
import { collectType } from './collect-type';

/** Extracts dates from the given object. */
export function extractDates(source: unknown): ExtractedObjectDates {
  if (!source) {
    return undefined;
  }
  const output: ExtractedObjectDates = { all: [] };
  output.all = collectType<DateTime>(
    source,
    v => DateTime.isDateTime(tryToDateTime(v)),
    (v: string | DateTime) => toDateTime(v),
  );
  output.all = orderBy(output.all, v => v.value);
  return output;
}
