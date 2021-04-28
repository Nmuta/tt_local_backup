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
import BigNumber from 'bignumber.js';

export interface KustoFunctionOptions {
  name: string;
  useSplitting: boolean;
  useEndDate: boolean;
  numberOfBuckets?: BigNumber;
}

/** A form component for a single kusto function's configuration. */
@Component({
  selector: 'kusto-function',
  templateUrl: './kusto-function.component.html',
  styleUrls: ['./kusto-function.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KustoFunctionComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => KustoFunctionComponent),
      multi: true,
    },
  ],
})
export class KustoFunctionComponent implements ControlValueAccessor, Validator {
  public static defaults: KustoFunctionOptions = {
    name: '',
    useSplitting: false,
    useEndDate: false,
    numberOfBuckets: null,
  };

  public formControls = {
    name: new FormControl(KustoFunctionComponent.defaults.name, [Validators.required]),
    useSplitting: new FormControl(KustoFunctionComponent.defaults.useSplitting),
    useEndDate: new FormControl(KustoFunctionComponent.defaults.useEndDate),
    numberOfBuckets: new FormControl(KustoFunctionComponent.defaults.numberOfBuckets),
  };

  public formGroup = new FormGroup({
    name: this.formControls.name,
    useSplitting: this.formControls.useSplitting,
    useEndDate: this.formControls.useEndDate,
    numberOfBuckets: this.formControls.numberOfBuckets,
  });

  constructor() {
    this.formGroup.valueChanges.subscribe(data => this.changeFn(data));
  }

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: KustoFunctionOptions) => void): void {
    this.changeFn = fn;
    this.changeFn(this.formGroup.value);
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

  private changeFn = (_data: KustoFunctionOptions) => {
    /* Empty */
  };
}
