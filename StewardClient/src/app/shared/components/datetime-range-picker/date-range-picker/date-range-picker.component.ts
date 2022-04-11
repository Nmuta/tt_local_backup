import { AfterViewInit, Component, forwardRef, Input, ViewChild } from '@angular/core';
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
import { MatButtonToggle, MatButtonToggleChange } from '@angular/material/button-toggle';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { delay, map, retry, startWith, tap } from 'rxjs/operators';
import { DateTimeRange, stringifyDateTimeRange } from '@models/datetime-range';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, MatLuxonDateAdapterOptions } from 'ngx-material-luxon';

/** Outputted form value of the date range picker. */
export type DateRangePickerFormValue = DateTimeRange;

/** Represents a datetime range option. */
export interface DatetimeRangeOption extends DateTimeRange {
  name: string;
}

interface DateRangePickerFormValueInternal {
  dateRange: DateRangePickerFormValue;
}

/** Utility component for selecting a date+time range. */
@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: <MatLuxonDateAdapterOptions>{},
    },
  ],
})
export class DateRangePickerComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator, AfterViewInit
{
  @ViewChild('defaultToggle') defaultToggle: MatButtonToggle;
  @Input() toggleOptions: DatetimeRangeOption[] = [];

  private defaultRange = {
    dateRange: {
      start: DateTime.local().minus({ days: 7 }),
      end: DateTime.local(),
    },
  };

  public formControls = {
    dateRange: {
      start: new FormControl(this.defaultRange.dateRange.start),
      end: new FormControl(this.defaultRange.dateRange.end),
    },
  };

  public formGroup = new FormGroup({
    dateRange: new FormGroup({
      start: this.formControls.dateRange.start,
      end: this.formControls.dateRange.end,
    }),
  });

  public disabled: boolean;
  public currentDates = this.mergeDates(this.formGroup.value);
  public timezone = DateTime.local().toFormat('ZZZZ');
  private readonly onChanges$ = new Subject<DateRangePickerFormValueInternal>();

  constructor() {
    super();
    let lastValueStringified: { start: string; end: string } = null;

    this.onChanges$
      .pipe(
        map((data: DateRangePickerFormValueInternal) => {
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
        delay(0), // must happen *after* the view updates. this gets it in the queue
      )
      .subscribe(value => {
        const valueStringified = stringifyDateTimeRange(value);
        const hasChanges = !isEqual(valueStringified, lastValueStringified);

        // when there are changes and the values do not match, revalidate everything
        if (hasChanges) {
          this.formControls.dateRange.start.updateValueAndValidity();
          this.formControls.dateRange.end.updateValueAndValidity();
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
  public writeValue(data: DateRangePickerFormValue): void {
    if (data) {
      const dataInternal: DateRangePickerFormValueInternal = {
        dateRange: {
          start: data.start,
          end: data.end,
        },
      };

      this.formGroup.patchValue(dataInternal, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: DateRangePickerFormValue) => void): void {
    this.onChangeFn = fn;
    this.onChanges$.next(this.formGroup.value);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
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

  /** Action when date range picker's state changes. */
  public datePickerClosed(): void {
    if (!!this.defaultToggle) {
      this.defaultToggle.checked = true;
    }
  }

  /** Action when the date range toggle options are clicked */
  public toggleOptionChange(event: MatButtonToggleChange): void {
    if (!event.value) {
      return;
    }

    const option = event.value as DatetimeRangeOption;

    this.formControls.dateRange.start.setValue(option.start);
    this.formControls.dateRange.end.setValue(option.end);
  }

  private mergeDates(data: DateRangePickerFormValueInternal): DateRangePickerFormValue {
    return {
      start: data.dateRange.start.startOf('day'),
      end: data.dateRange.end.endOf('day'),
    };
  }

  private onChangeFn = (_data: DateRangePickerFormValue) => {
    /* empty */
  };
}
