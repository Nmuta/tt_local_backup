import { ChangeDetectorRef, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { clone, first } from 'lodash';
import { DateTime, Duration } from 'luxon';

export interface DurationOption {
  duration: Duration;
  humanized: string;
}

export const DurationPickerOptions: DurationOption[] = [
  { duration: Duration.fromObject({ days: 7 }), humanized: '1 week' },
  { duration: Duration.fromObject({ month: 1 }), humanized: '1 month' },
  { duration: Duration.fromObject({ years: 20 }), humanized: '20 years' },
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
export class DurationPickerComponent implements OnInit, ControlValueAccessor {
  @ViewChild('datePicker') public datePicker: MatDatepicker<Date>;

  /** Toggles view of date preview. */
  @Input() public hideDatePreview: boolean = false;

  public options: DurationOption[] = DurationPickerOptions;

  public formControl = new UntypedFormControl(first(this.options).duration);

  public targetDate: DateTime = null;

  constructor(private readonly store: Store, private readonly ref: ChangeDetectorRef) {
    this.formControl.valueChanges.subscribe(value => this.updateDate(value));
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.options = clone(DurationPickerOptions);
    if (profile && profile.role === UserRole.LiveOpsAdmin) {
      this.options.unshift(
        {
          duration: Duration.fromObject({ minutes: 1 }),
          humanized: '1 minute',
        } as DurationOption,
        {
          duration: Duration.fromObject({ minutes: 30 }),
          humanized: '30 minutes',
        } as DurationOption,
      );
    }
  }

  /** Updates the displayed date. */
  public updateDate(newDuration: Duration): void {
    const today = DateTime.local().startOf('day');
    const endDate = today.plus(newDuration);
    this.targetDate = endDate;
  }

  /** ngModel hook. */
  public writeValue(newDuration: Duration): void {
    if (newDuration) {
      this.formControl.setValue(newDuration, { emitEvent: false });
      this.updateDate(this.formControl.value);
    }
  }

  /** ngModel hook. */
  public registerOnChange(callback: (value: Duration) => void): void {
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
