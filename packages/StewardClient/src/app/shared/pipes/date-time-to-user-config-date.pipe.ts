import { Pipe, PipeTransform } from '@angular/core';
import { TimeService } from '@services/time/time.service';
import { DateTime } from 'luxon';

/**
 *  Accept a DateTime, localize it to user time zone and return JS Date. 
 */
@Pipe({
  name: 'DateTimeToUserConfigDate',
  pure: false,
})
export class DateTimeToUserConfigDatePipe implements PipeTransform {
  constructor(private timeService: TimeService){}
  /**
   * pipe hook 
   */
  public transform(value: DateTime | null | undefined): Date | null {
    const zone = this.timeService.getLocalTimeConfig().zone;
    if (value instanceof DateTime) {
      return value.setZone(zone).toJSDate();
    }

    return null;
  }
}
