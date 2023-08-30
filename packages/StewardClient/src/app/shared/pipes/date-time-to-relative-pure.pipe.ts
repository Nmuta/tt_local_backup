import { Pipe, PipeTransform } from '@angular/core';
import { DateTime, ToRelativeUnit } from 'luxon';

/**
 * A pure version of https://github.com/dstelljes/luxon-angular/blob/master/projects/luxon-angular/src/lib/formatting/date-time-to-relative.pipe.ts
 */
@Pipe({ name: 'dateTimeToRelativePure' })
export class DateTimeToRelativePurePipe implements PipeTransform {
  /** Angular pipe hook. */
  public transform<T extends DateTime | null | undefined>(
    value: T,
    unit?: ToRelativeUnit,
    style?: 'long' | 'short' | 'narrow',
  ): string {
    if (!value) {
      return null;
    }

    return (value as DateTime).toRelative({
      style,
      unit,
    });
  }
}
