import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';
import { StandardAbsoluteDateTimeFormats } from '../standard-absolute-datetime.models';

/** Prints out a standard absolute date, with copy controls and tooltips. */
@Component({
  selector: 'standard-absolute-time',
  templateUrl: './standard-absolute-time.component.html',
  styleUrls: ['./standard-absolute-time.component.scss'],
})
export class StandardAbsoluteTimeComponent {
  /** REVIEW-COMMENT: The target time. */
  @Input() timeUtc: DateTime;
  /** REVIEW-COMMENT: Datetime format. Default to "shortMedium". */
  @Input() format: keyof StandardAbsoluteDateTimeFormats = 'shortMedium';

  /** Format mapping for the angular pipes. */
  public formats: StandardAbsoluteDateTimeFormats = {
    shortMedium: { dateFormat: 'shortDate', timeFormat: 'mediumTime' },
  };
}
