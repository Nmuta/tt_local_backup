import { DateTime } from 'luxon';

/** Converts the given source to a Luxon DateTime, if possible. */
export function toDateTime(source: string | DateTime | Date): DateTime {
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
