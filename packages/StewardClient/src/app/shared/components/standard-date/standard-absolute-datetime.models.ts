/** A date-time format pairing. */
export interface StandardAbsoluteDateTimeFormat {
  timeFormat: string | undefined;
  dateFormat: string | undefined;
}

/** Available date-time format pairings. */
export interface StandardAbsoluteDateTimeFormats {
  /** Short Date + Medium Time; Requested by Bridgette. */
  shortMedium: StandardAbsoluteDateTimeFormat;
}
