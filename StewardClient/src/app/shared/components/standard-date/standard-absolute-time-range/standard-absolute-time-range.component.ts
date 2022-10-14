import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';
import { StandardAbsoluteDateTimeFormats } from '../standard-absolute-datetime.models';

/** Prints out a standard absolute date, with copy controls and tooltips. */
@Component({
  selector: 'standard-absolute-time-range',
  templateUrl: './standard-absolute-time-range.component.html',
  styleUrls: ['./standard-absolute-time-range.component.scss'],
})
export class StandardAbsoluteTimeRangeComponent {
  /** REVIEW-COMMENT: The target start time. */
  @Input() startTimeUtc: DateTime;
  /** REVIEW-COMMENT: The target end time. */
  @Input() endTimeUtc: DateTime;
  /** REVIEW-COMMENT: Datetime format. Default to "shortMedium". */
  @Input() format: keyof StandardAbsoluteDateTimeFormats = 'shortMedium';

  /** Format mapping for the angular pipes. */
  public formats: StandardAbsoluteDateTimeFormats = {
    shortMedium: { dateFormat: 'shortDate', timeFormat: 'mediumTime' },
  };
}
