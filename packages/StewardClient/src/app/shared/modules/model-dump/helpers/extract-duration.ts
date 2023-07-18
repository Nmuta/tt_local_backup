import { Duration } from 'luxon';
import { ExtractedObjectDurations } from './extracted-model';
import { collectType } from './collect-type';

/** Extracts durations from the given object. */
export function extractDurations(source: unknown): ExtractedObjectDurations {
  if (!source) {
    return undefined;
  }
  const output: ExtractedObjectDurations = { all: [] };
  output.all = collectType<Duration>(source, v => Duration.isDuration(v));
  return output;
}
