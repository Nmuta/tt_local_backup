import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { remove } from 'lodash';

export type DependencyListOptions = string[];

/** A form component for creating a variable number of Obligation Data Activity Dependencies. */
@Component({
  selector: 'dependency-list',
  templateUrl: './dependency-list.component.html',
  styleUrls: ['./dependency-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DependencyListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DependencyListComponent),
      multi: true,
    },
  ],
})
export class DependencyListComponent implements ControlValueAccessor, Validator {
  public static readonly defaults: DependencyListOptions = [];

  public inputFormControl = new FormControl();
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public formControls = [];

  public formArray = new FormArray([]);

  // NOTE: This is just a container object becuase FormArray must be contained within one.
  // NOTE: Normally, this would be used for the output type output of this would be the output type,
  // NOTE: but in this case, the output type is the FormArray contents.
  public formGroup = new FormGroup({
    activities: this.formArray,
  });

  constructor() {
    this.overrideList(DependencyListComponent.defaults);
  }

  /** Form control hook. */
  public writeValue(data: DependencyListOptions): void {
    if (data) {
      if (data.length !== this.formArray.length) {
        // if the list actually changed, we need to recreate the array
        this.overrideList(data);
      } else {
        // otherwise we can just patch the existing array
        this.formArray.patchValue(data, { emitEvent: false });
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: DependencyListOptions) => void): void {
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
  public removeDependency(activityFormControl: FormControl): void {
    remove(this.formControls, i => i === activityFormControl);
  }

  /** Called when the "add" button is clicked. */
  public addDependency(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.formControls.push(this.valueToFormControl(value.trim()));
    }

    if (input) {
      input.value = '';
    }
  }

  /** Overrides the list when a new list is created. */
  private overrideList(options: DependencyListOptions): void {
    this.formControls = options.map(v => this.valueToFormControl(v));
    this.formArray = new FormArray(this.formControls);
    this.formGroup = new FormGroup({ activities: this.formArray });
  }

  /** Hook for adding standardized validators to each form control. */
  private valueToFormControl(v: string): FormControl {
    return new FormControl(v);
  }

  private changeFn = (_data: DependencyListOptions) => {
    /* Empty */
  };
}
