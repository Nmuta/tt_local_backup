import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';
import { StandardAbsoluteDateTimeFormats } from '../standard-absolute-datetime.models';

/** Prints out a standard absolute date, with copy controls and tooltips. */
@Component({
  selector: 'standard-absolute-time-utc',
  templateUrl: './standard-absolute-time-utc.component.html',
  styleUrls: ['./standard-absolute-time-utc.component.scss'],
})
export class StandardAbsoluteTimeUtcComponent {
  /** The target time. */
  @Input() timeUtc: DateTime;
  @Input() format: keyof StandardAbsoluteDateTimeFormats = 'shortMedium';

  /** Format mapping for the angular pipes. */
  public formats: StandardAbsoluteDateTimeFormats = {
    shortMedium: { dateFormat: 'shortDate', timeFormat: 'mediumTime' },
  };
}
