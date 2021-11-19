import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'luxon';

/** This pipe is missing from luxon-angular, so I have added it. */
@Pipe({ name: 'durationToMillis' })
export class DurationToMillisPipe implements PipeTransform {
  /** Angular hook. */
  public transform(value: Duration): number {
    // luxon Durations now have a `toMillis()` function, but it was not added to the type defs, apparently
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (value as any).toMillis();
  }
}
