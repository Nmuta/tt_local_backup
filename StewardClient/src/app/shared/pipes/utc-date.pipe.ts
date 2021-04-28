import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/** A pipe that prints a nice date in UTC time zone. */
@Pipe({
  name: 'utcDate',
})
export class UtcDatePipe implements PipeTransform {
  /** Pipe hook. */
  public transform(value: Date, format?: string): unknown {
    return new DatePipe('en-US').transform(value, format, '+0');
  }
}
