import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { BaseComponent } from '@components/base-component/base-component.component';
import { first } from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs';

interface DurationOption {
  duration: moment.Duration,
  humanized: string,
}

/** Allows selection of a duration. Compatible with ngModel. */
@Component({
  selector: 'duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss'],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DurationPickerComponent),
      multi: true
  }]

})
export class DurationPickerComponent extends BaseComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('datePicker') public datePicker: MatDatepicker<Date>;

  /** The current duration. Named this for ngModel compatibility. */
  public value: moment.Duration;

  public options: DurationOption[] = [
    { duration: moment.duration(1, 'week'), humanized: '1 week' },
    { duration: moment.duration(1, 'month'), humanized: '1 month' },
    { duration: moment.duration(20, 'years'), humanized: '20 years' },
  ];

  public isDisabled: boolean;

  private onChange$ = new Subject<moment.Duration>();

  constructor(private ref: ChangeDetectorRef) {
    super();
    this.onDestroy$.subscribe(() => this.onChange$.complete());
    this.onChange$.subscribe(value => this.updateDate(value));
  }

  /** Init hook. */
  public ngAfterViewInit(): void {
    // we're required to synchronize the UI after view init, due to the nature of @ViewChild.
    // We also extract a default value here to ensure that the caller doesn't have to deal set a default value.
    this.value = first(this.options).duration;
    this.onChange$.next(this.value);
    this.ref.markForCheck();
  }

  /** Called when the option is pressed. */
  public onDurationChange(_newDuration: moment.Duration): void {
    this.onChange$.next(this.value);
  }

  /** Updates the displayed date. */
  public updateDate(newDuration: moment.Duration): void {
    const today = moment().startOf('day');
    const endDate = today.add(newDuration);
    this.datePicker.select(endDate.toDate());
  }

  /** ngModel hook. */
  public writeValue(newDuration: moment.Duration): void {
    this.value = newDuration;
    this.updateDate(this.value);
  }

  /** ngModel hook. */
  public registerOnChange(callback: (value: moment.Duration) => void): void {
    this.onChange$.subscribe(value => callback(value));
  }

  /** ngModel hook. */
  public registerOnTouched(_callback: unknown): void { /** intentionally blank. */ }

  /** ngModel hook. */
  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
