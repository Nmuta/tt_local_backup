import { AfterViewInit, Component, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { delay, map, pairwise, retry, startWith, tap } from 'rxjs/operators';

export interface DatetimeRangePickerOptions {
  start: DateTime;
  end: DateTime;
}

interface DatetimeRangePickerOptionsInternal {
  dateRange: {
    start: DateTime;
    end: DateTime;
  };
  timeRange: {
    start: DateTime;
    end: DateTime;
  };
}

/** Utility component for selecting a date+time range. */
@Component({
  selector: 'datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html',
  styleUrls: ['./datetime-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeRangePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatetimeRangePickerComponent),
      multi: true,
    },
  ],
})
export class DatetimeRangePickerComponent
  implements ControlValueAccessor, Validator, AfterViewInit {
  private static readonly UTC_NOW = DateTime.utc();
  public defaults: DatetimeRangePickerOptionsInternal = {
    dateRange: {
      start: DatetimeRangePickerComponent.UTC_NOW,
      end: DatetimeRangePickerComponent.UTC_NOW.plus({ days: 7 }),
    },
    timeRange: {
      start: DatetimeRangePickerComponent.UTC_NOW,
      end: DatetimeRangePickerComponent.UTC_NOW,
    },
  };

  public formControls = {
    dateRange: {
      start: new FormControl(
        this.defaults.dateRange.start /** Date controls are always required */,
      ),
      end: new FormControl(this.defaults.dateRange.end /** Date controls are always required */),
    },
    timeRange: {
      start: new FormControl(
        this.defaults.timeRange.start /** Date controls are always required */,
      ),
      end: new FormControl(this.defaults.timeRange.end /** Date controls are always required */),
    },
  };

  public formGroup = new FormGroup({
    dateRange: new FormGroup({
      start: this.formControls.dateRange.start,
      end: this.formControls.dateRange.end,
    }),
    timeRange: new FormGroup({
      start: this.formControls.timeRange.start,
      end: this.formControls.timeRange.end,
    }),
  });

  public currentDates = this.mergeDates(this.formGroup.value);
  private readonly onChanges$ = new Subject<DatetimeRangePickerOptionsInternal>();

  constructor() {
    // when anything in the form group changes, trigger a change event
    this.formGroup.valueChanges.subscribe(this.onChanges$);

    this.onChanges$
      .pipe(
        startWith(this.formGroup.value), // start with the initial value, so pairwise will work on every new value
        map((data: DatetimeRangePickerOptionsInternal) => {
          // when there are changes, convert the date and forward it onward
          // must occur before revalidation
          return this.mergeDates(data);
        }),
        retry(), // do not stop on partial data
        tap(data => {
          // update our values before the validation step
          this.currentDates = data;
          this.onChangeFn(data);
        }),
        pairwise(), // track previous + current value for trigger below
        delay(0), // must happen *after* the view updates. this gets it in the queue
      )
      .subscribe(([oldValue, newValue]) => {
        // when there are changes and the values do not match, revalidate everything
        if (!isEqual(oldValue, newValue)) {
          this.formControls.dateRange.start.updateValueAndValidity();
          this.formControls.dateRange.end.updateValueAndValidity();
          this.formControls.timeRange.start.updateValueAndValidity();
          this.formControls.timeRange.end.updateValueAndValidity();
        }
      });
  }

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    this.onChanges$.next(this.formGroup.value);
  }

  /** Form control hook. */
  public writeValue(data: DatetimeRangePickerOptions): void {
    if (data) {
      const dataInternal: DatetimeRangePickerOptionsInternal = {
        dateRange: {
          start: data.start,
          end: data.end,
        },
        timeRange: {
          start: data.start,
          end: data.end,
        },
      };

      this.formGroup.patchValue(dataInternal, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: DatetimeRangePickerOptions) => void): void {
    this.onChangeFn = fn;
    this.onChanges$.next(this.formGroup.value);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }

  private mergeDates(data: DatetimeRangePickerOptionsInternal): DatetimeRangePickerOptions {
    return {
      start: this.mergeDayAndTime(data.dateRange.start, data.timeRange.start),
      end: this.mergeDayAndTime(data.dateRange.end, data.timeRange.end),
    };
  }

  private mergeDayAndTime(day: DateTime, time: DateTime): DateTime {
    const startOfTargetDay = day.startOf('day');
    const startOfTimeDay = time.startOf('day');
    const timeDiff = time.diff(startOfTimeDay);
    const targetDateTime = startOfTargetDay.plus(timeDiff);
    return targetDateTime;
  }

  private onChangeFn = (_data: DatetimeRangePickerOptions) => {
    /* empty */
  };
}
