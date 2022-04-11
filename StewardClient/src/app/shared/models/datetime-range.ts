import { DateTime } from 'luxon';

/** Represents a datetime range. */
export interface DateTimeRange {
  start: DateTime;
  end: DateTime;
}

/** Stringify datetime range. */
export function stringifyDateTimeRange(rawData: DateTimeRange): {
  start: string;
  end: string;
} {
  return {
    start: rawData?.start?.toString(),
    end: rawData?.end?.toString(),
  };
}
