import { forwardRef } from '@angular/core';
import { Component } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { cloneDeep, remove } from 'lodash';
import {
  ObligationDataActivityComponent,
  ObligationDataActivityOptions,
} from '../obligation-data-activity/obligation-data-activity.component';

export type ObligationDataActivitiesOptions = ObligationDataActivityOptions[];

/** A form component for creating a variable number of ObligationDataActivities. */
@Component({
  selector: 'obligation-data-activities',
  templateUrl: './obligation-data-activities.component.html',
  styleUrls: ['./obligation-data-activities.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ObligationDataActivitiesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ObligationDataActivitiesComponent),
      multi: true,
    },
  ],
})
export class ObligationDataActivitiesComponent implements ControlValueAccessor, Validator {
  public static readonly defaults: ObligationDataActivitiesOptions = [
    cloneDeep(ObligationDataActivityComponent.defaults),
  ];

  public formControls = [];

  public formArray = new FormArray([]);

  // NOTE: This is just a container object becuase FormArray must be contained within one.
  // NOTE: Normally, this would be used for the output type output of this would be the output type,
  // NOTE: but in this case, the output type is the FormArray contents.
  public formGroup = new FormGroup({
    activities: this.formArray,
  });

  constructor() {
    this.overrideList(ObligationDataActivitiesComponent.defaults);
  }

  /** Form control hook. */
  public writeValue(data: ObligationDataActivitiesOptions): void {
    if (data) {
      if (data.length !== this.formArray.length) {
        // if the list actually changed, we need to recreate the array
        this.overrideList(data);
        this.formArray.valueChanges.subscribe(this.changeFn);
      } else {
        // otherwise we can just patch the existing array
        this.formArray.patchValue(data, { emitEvent: false });
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: ObligationDataActivitiesOptions) => void): void {
    this.changeFn = fn;
    this.formArray.valueChanges.subscribe(this.changeFn);
    this.changeFn(this.formArray.value);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formArray.disable();
    } else {
      this.formArray.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formArray.invalid) {
      return collectErrors(this.formArray);
    }

    return null;
  }

  /** Called when the "delete" button is clicked. */
  public removeActivity(activityFormControl: FormControl): void {
    remove(this.formControls, i => i === activityFormControl);
  }

  /** Called when the "add" button is clicked. */
  public addActivity(): void {
    this.formArray.push(
      this.valueToFormControl(cloneDeep(ObligationDataActivityComponent.defaults)),
    );
  }

  /** Overrides the list when a new list is created. */
  private overrideList(options: ObligationDataActivitiesOptions): void {
    this.formControls = options.map(v => this.valueToFormControl(v));
    this.formArray = new FormArray(this.formControls, Validators.minLength(1));
    this.formGroup = new FormGroup({ activities: this.formArray });
  }

  /** Hook for adding standardized validators to each form control. */
  private valueToFormControl(v: ObligationDataActivityOptions): FormControl {
    return new FormControl(v);
  }

  private changeFn = (_data: ObligationDataActivitiesOptions) => {
    /* Empty */
  };
}
