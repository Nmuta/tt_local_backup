import { Pipe, PipeTransform } from '@angular/core';
import { toDateTime } from '@helpers/luxon';
import { DateTime } from 'luxon';

/** A pipe that prints a nice date in UTC time zone. */
@Pipe({
  name: 'toDateTime',
})
export class ToDateTimePipe implements PipeTransform {
  /** Pipe hook. */
  public transform(value: DateTime | Date | string): DateTime {
    return toDateTime(value);
  }
}
