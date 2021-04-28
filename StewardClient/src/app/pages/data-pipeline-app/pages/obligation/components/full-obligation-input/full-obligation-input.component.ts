import { Component, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { cloneDeep } from 'lodash';
import { ObligationDataActivitiesComponent } from '../obligation-data-activities/obligation-data-activities.component';
import { ObligationDataActivityOptions } from '../obligation-data-activity/obligation-data-activity.component';

export interface ObligationOptions {
  name: string;
  description: string;
  dataActivities: ObligationDataActivityOptions[];
}

/** A form component that bundles all the validation of a full obligation item. */
@Component({
  selector: 'full-obligation-input',
  templateUrl: './full-obligation-input.component.html',
  styleUrls: ['./full-obligation-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FullObligationInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FullObligationInputComponent),
      multi: true,
    },
  ],
})
export class FullObligationInputComponent implements ControlValueAccessor, Validator {
  public static readonly defaults: ObligationOptions = {
    name: '',
    description: '',
    dataActivities: cloneDeep(ObligationDataActivitiesComponent.defaults),
  };

  public formControls = {
    name: new FormControl(FullObligationInputComponent.defaults.name, [Validators.required]),
    description: new FormControl(FullObligationInputComponent.defaults.description, [
      Validators.required,
    ]),
    dataActivities: new FormControl(FullObligationInputComponent.defaults.dataActivities, [
      Validators.required,
      Validators.minLength(1),
    ]),
  };

  public formGroup = new FormGroup({
    name: this.formControls.name,
    description: this.formControls.description,
    dataActivities: this.formControls.dataActivities,
  });

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.setValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: ObligationOptions) => void): void {
    this.formGroup.valueChanges.subscribe(fn);
    fn(this.formGroup.value);
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
}
