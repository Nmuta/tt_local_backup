import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { DateTime } from 'luxon';

/** Select date range starting at date of UTC now. */
@Injectable()
export class ForceStartDateToUtcNowSelectionStrategy<D>
  implements MatDateRangeSelectionStrategy<D>
{
  constructor(private readonly _dateAdapter: DateAdapter<D>) {}

  /** Select span that starts at current UTC time */
  public selectionFinished(date: D | null): DateRange<D> {
    return this.forceStartDate(date);
  }

  /** Select span that starts at current UTC time */
  public createPreview(activeDate: D | null): DateRange<D> {
    return this.forceStartDate(activeDate);
  }

  private forceStartDate(date: D | null): DateRange<D> {
    if (!!date) {
      const utc = DateTime.utc();
      const start = this._dateAdapter.createDate(utc.year, utc.month - 1, utc.day);
      const end = this._dateAdapter.addCalendarDays(date, 0);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
