import { AfterViewInit, Component, forwardRef, Input } from '@angular/core';
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
import { renderDelay } from '@helpers/rxjs';
import { DateTimeRange, stringifyDateTimeRange } from '@models/datetime-range';
import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, MatLuxonDateAdapterOptions } from 'ngx-material-luxon';
import { Subject } from 'rxjs';
import { map, retry, startWith, tap } from 'rxjs/operators';

/** Outputted form value of the datetime range picker. */
export type DatetimeRangePickerFormValue = DateTimeRange;

interface DatetimeRangePickerFormValueInternal {
  dateRange: DatetimeRangePickerFormValue;
  timeRange: DatetimeRangePickerFormValue;
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
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: <MatLuxonDateAdapterOptions>{ useUtc: true },
    },
  ],
})
export class DatetimeRangePickerComponent
  implements ControlValueAccessor, Validator, AfterViewInit
{
  private static readonly UTC_NOW = DateTime.utc();

  @Input()
  public min: DateTime = DateTime.fromObject({ year: 2000, month: 1, day: 1 });

  @Input()
  public disableStartTime: boolean = false;

  public calculatedMinStartTime: DateTime;
  public calculatedMinEndTime: DateTime;

  public defaults: DatetimeRangePickerFormValueInternal = {
    dateRange: {
      start: DatetimeRangePickerComponent.UTC_NOW,
      end: DatetimeRangePickerComponent.UTC_NOW.plus({ days: 7 }).toUTC(),
    },
    timeRange: {
      start: DatetimeRangePickerComponent.UTC_NOW.startOf('day').toUTC(),
      end: DatetimeRangePickerComponent.UTC_NOW.startOf('day').toUTC(),
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
  private readonly onChanges$ = new Subject<DatetimeRangePickerFormValueInternal>();

  constructor() {
    let lastValueStringified: { start: string; end: string } = null;
    this.onChanges$
      .pipe(
        map((data: DatetimeRangePickerFormValueInternal) => {
          // when there are changes, convert the date and forward it onward
          // must occur before revalidation
          return this.mergeDates(data);
        }),
        retry(), // do not stop on partial data
        tap(value => {
          // update our values before waiting for the view to update
          this.currentDates = value;
          this.onChangeFn(value);
        }),
        renderDelay(),
      )
      .subscribe(value => {
        const valueStringified = stringifyDateTimeRange(value);
        const hasChanges = !isEqual(valueStringified, lastValueStringified);

        // when there are changes and the values do not match, revalidate everything
        if (hasChanges) {
          this.formControls.dateRange.start.updateValueAndValidity();
          this.formControls.dateRange.end.updateValueAndValidity();
          this.formControls.timeRange.start.updateValueAndValidity();
          this.formControls.timeRange.end.updateValueAndValidity();

          this.calculatedMinStartTime = this.calculateMinTime(
            this.formControls.dateRange.start.value,
          );
          this.calculatedMinEndTime = this.calculateMinTime(this.formControls.dateRange.end.value);
        }

        // prep for next iteration
        lastValueStringified = valueStringified;
      });

    // when anything in the form group changes, trigger a change event
    this.formGroup.valueChanges
      .pipe(
        startWith({ initial: true, ...this.formGroup.value }), // start with the initial value, so pairwise will work on every new value
      )
      .subscribe(this.onChanges$);
  }

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    this.onChanges$.next(this.formGroup.value);
    this.formGroup.updateValueAndValidity();
  }

  /** Form control hook. */
  public writeValue(data: DatetimeRangePickerFormValue): void {
    if (data) {
      const dataInternal: DatetimeRangePickerFormValueInternal = {
        dateRange: {
          start: data.start.toUTC(),
          end: data.end.toUTC(),
        },
        timeRange: {
          start: data.start.toUTC(),
          end: data.end.toUTC(),
        },
      };

      this.formGroup.patchValue(dataInternal, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: DatetimeRangePickerFormValue) => void): void {
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

  /**
   * Blocks selection of dates prior to defined minimum.
   * @param {DateTime} comparisonTime should either be dateRange.start or dateRange.end
   */
  public calculateMinTime = (comparisonTime: DateTime): DateTime => {
    const shouldFilterTime = comparisonTime.day == this.min.day;
    if (shouldFilterTime) {
      return this.min; //Restrict selection to minimum.
    }

    return DateTime.utc().startOf('day'); //Allow selection of any time.
  };

  private mergeDates(data: DatetimeRangePickerFormValueInternal): DatetimeRangePickerFormValue {
    return {
      start: this.mergeDayAndTime(data.dateRange.start, data.timeRange.start),
      end: this.mergeDayAndTime(data.dateRange.end, data.timeRange.end),
    };
  }

  private mergeDayAndTime(day: DateTime, time: DateTime): DateTime {
    try {
      if (!day) {
        return null;
      }
      if (!time) {
        return null;
      }
      day = day?.toUTC();
      time = time?.toUTC();
      const startOfTargetDay = day.startOf('day');
      const startOfTimeDay = time.startOf('day');
      const timeDiff = time.diff(startOfTimeDay);
      const targetDateTime = startOfTargetDay.plus(timeDiff);
      return targetDateTime;
    } catch (ex) {
      return null;
    }
  }

  private onChangeFn = (_data: DatetimeRangePickerFormValue) => {
    /* empty */
  };
}
