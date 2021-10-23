import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';

/** Prints out a standard relative date, with copy controls and tooltips. */
@Component({
  selector: 'standard-relative-time',
  templateUrl: './standard-relative-time.component.html',
  styleUrls: ['./standard-relative-time.component.scss'],
})
export class StandardRelativeTimeComponent {
  /** The target time. */
  @Input() timeUtc: DateTime;
}
