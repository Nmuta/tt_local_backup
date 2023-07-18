import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';

/** Prints out a standard relative date, with copy controls and tooltips. */
@Component({
  selector: 'standard-relative-time-range',
  templateUrl: './standard-relative-time-range.component.html',
  styleUrls: ['./standard-relative-time-range.component.scss'],
})
export class StandardRelativeTimeRangeComponent {
  /** The target start time. */
  @Input() startTimeUtc: DateTime;
  /** The target end time. */
  @Input() endTimeUtc: DateTime;
}
