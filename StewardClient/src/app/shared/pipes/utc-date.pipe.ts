import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { toDateTime } from '@helpers/luxon';
import { DateTime } from 'luxon';

/** A pipe that prints a nice date in UTC time zone. */
@Pipe({
  name: 'utcDate',
})
export class UtcDatePipe implements PipeTransform {
  /** Pipe hook. */
  public transform(value: DateTime | Date, format?: string): unknown {
    return new DatePipe('en-US').transform(toDateTime(value).toJSDate(), format, '+0');
  }
}
