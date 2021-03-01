import { ChangeDetectorRef, Component, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { first } from 'lodash';
import * as moment from 'moment';

interface DurationOption {
  duration: moment.Duration;
  humanized: string;
}

export const DurationPickerOptions: DurationOption[] = [
  { duration: moment.duration(1, 'minute'), humanized: '1 minute' },
  { duration: moment.duration(1, 'week'), humanized: '1 week' },
  { duration: moment.duration(1, 'month'), humanized: '1 month' },
  { duration: moment.duration(20, 'years'), humanized: '20 years' },
];

/** Allows selection of a duration. Compatible with ngModel. */
@Component({
  selector: 'duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DurationPickerComponent),
      multi: true,
    },
  ],
})
export class DurationPickerComponent implements ControlValueAccessor {
  @ViewChild('datePicker') public datePicker: MatDatepicker<Date>;

  public options: DurationOption[] = DurationPickerOptions;

  public formControl = new FormControl(first(this.options).duration);

  public targetDate: Date = null;

  constructor(private ref: ChangeDetectorRef) {
    this.formControl.valueChanges.subscribe(value => this.updateDate(value));
  }

  /** Updates the displayed date. */
  public updateDate(newDuration: moment.Duration): void {
    const today = moment().startOf('day');
    const endDate = today.add(newDuration);
    this.targetDate = endDate.toDate();
  }

  /** ngModel hook. */
  public writeValue(newDuration: moment.Duration): void {
    if (newDuration) {
      this.formControl.setValue(newDuration, { emitEvent: false });
      this.updateDate(this.formControl.value);
    }
  }

  /** ngModel hook. */
  public registerOnChange(callback: (value: moment.Duration) => void): void {
    this.formControl.valueChanges.subscribe(callback);
  }

  /** ngModel hook. */
  public registerOnTouched(_callback: unknown): void {
    /** empty */
  }

  /** ngModel hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
}
