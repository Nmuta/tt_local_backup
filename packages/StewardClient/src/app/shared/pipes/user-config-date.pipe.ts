import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { toDateTime } from '@helpers/luxon';
import { TimeService } from '@services/time/time.service';
import { DateTime } from 'luxon';

/** A pipe that prints a nice date in UTC time zone. */
@Pipe({
  name: 'userConfigDate',
})
export class UserConfigDatePipe implements PipeTransform {
  constructor(private timeService: TimeService){}
  /** Pipe hook. */
  public transform(value: DateTime | Date | string, format?: string): unknown {
    const offset = this.timeService.getLocalTimeConfig().offset;
    console.log("my offset is ", offset)
    return new DatePipe('en-US').transform(toDateTime(value).toJSDate(), format, offset);
  }
}
