import { isNull, isUndefined } from 'lodash';
import { DateTime, Duration } from 'luxon';

/** Converts the given source to a Luxon DateTime, or returns null. */
export function tryToDateTime(source: unknown): DateTime {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const converted = toDateTime(source as any);
    if (converted.isValid) {
      return converted;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

/** Converts the given source to a Luxon DateTime or throws. */
export function toDateTime(source: string | DateTime | Date): DateTime {
  if (isUndefined(source) || isNull(source)) {
    return source;
  }

  if (source instanceof DateTime) {
    return source;
  }

  if (source instanceof Date) {
    return DateTime.fromJSDate(source);
  }

  if (typeof source === 'string') {
    return DateTime.fromISO(source);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const typeName = (source as object).constructor.name;
  throw new Error(`toDateTime source was of type ${typeName} and could not be converted`);
}

/** Converts the given source to a Luxon Duration, if possible. */
export function toDuration(source: string | Duration): Duration {
  if (isUndefined(source) || isNull(source)) {
    return source;
  }

  if (source instanceof Duration) {
    return source;
  }

  if (typeof source === 'string') {
    return Duration.fromISO(source);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const typeName = (source as object).constructor.name;
  throw new Error(`toDateTime source was of type ${typeName} and could not be converted`);
}
