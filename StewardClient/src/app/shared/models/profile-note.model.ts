import { DateTime } from 'luxon';

/** Player profile note. */
export interface ProfileNote {
  dateUtc: DateTime;
  author: string;
  text: string;
}
