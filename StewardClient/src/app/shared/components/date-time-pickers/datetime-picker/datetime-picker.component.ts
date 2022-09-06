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
import { renderDelay } from '@helpers/rxjs';
import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, MatLuxonDateAdapterOptions } from 'ngx-material-luxon';
import { Subject } from 'rxjs';
import { map, retry, startWith, tap } from 'rxjs/operators';

/** Outputted form value of the datetime picker. */
export type DatetimePickerFormValue = DateTime;

interface DatetimePickerFormValueInternal {
  date: DatetimePickerFormValue;
  time: DatetimePickerFormValue;
}

/** Utility component for selecting a date+time. */
@Component({
  selector: 'datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true,
    },
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: <MatLuxonDateAdapterOptions>{ useUtc: true },
    },
  ],
})
export class DatetimePickerComponent implements ControlValueAccessor, Validator, AfterViewInit {
  private static readonly UTC_NOW = DateTime.utc();
  public defaults: DatetimePickerFormValueInternal = {
    date: DatetimePickerComponent.UTC_NOW,
    time: DatetimePickerComponent.UTC_NOW,
  };

  public formControls = {
    date: new FormControl(this.defaults.date),
    time: new FormControl(this.defaults.time),
  };

  public formGroup = new FormGroup(this.formControls);

  public currentDates = this.mergeDates(this.formGroup.value);
  private readonly onChanges$ = new Subject<DatetimePickerFormValueInternal>();

  constructor() {
    let lastValueStringified: string = null;
    this.onChanges$
      .pipe(
        map((data: DatetimePickerFormValueInternal) => {
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
        const valueStringified = value?.toString();
        const hasChanges = !isEqual(valueStringified, lastValueStringified);

        // when there are changes and the values do not match, revalidate everything
        if (hasChanges) {
          this.formControls.date.updateValueAndValidity();
          this.formControls.time.updateValueAndValidity();
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
  public writeValue(data: DatetimePickerFormValue): void {
    if (data) {
      const dataInternal: DatetimePickerFormValueInternal = {
        date: data,
        time: data,
      };

      this.formGroup.patchValue(dataInternal, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: DatetimePickerFormValue) => void): void {
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

  private mergeDates(data: DatetimePickerFormValueInternal): DatetimePickerFormValue {
    return this.mergeDayAndTime(data.date, data.time);
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

  private onChangeFn = (_data: DatetimePickerFormValue) => {
    /* empty */
  };
}
