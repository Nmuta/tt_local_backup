import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';

/** A date-time format pairing. */
interface StandardAbsoluteDateTimeFormat {
  timeFormat: string | undefined;
  dateFormat: string | undefined;
}

/** Available date-time format pairings. */
interface StandardAbsoluteDateTimeFormats {
  /** Short Date + Medium Time; Requested by Bridgette. */
  shortMedium: StandardAbsoluteDateTimeFormat;
}

/** Prints out a standard absolute date, with copy controls and tooltips. */
@Component({
  selector: 'standard-absolute-time',
  templateUrl: './standard-absolute-time.component.html',
  styleUrls: ['./standard-absolute-time.component.scss'],
})
export class StandardAbsoluteTimeComponent {
  /** The target time. */
  @Input() timeUtc: DateTime;
  @Input() format: keyof StandardAbsoluteDateTimeFormats = 'shortMedium';

  /** Format mapping for the angular pipes. */
  public formats: StandardAbsoluteDateTimeFormats = {
    shortMedium: { dateFormat: 'shortDate', timeFormat: 'mediumTime' },
  };
}
