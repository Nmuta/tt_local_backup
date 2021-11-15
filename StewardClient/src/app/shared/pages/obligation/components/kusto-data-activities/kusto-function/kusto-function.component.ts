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
import { StringValidators } from '@shared/validators/string-validators';

export interface KustoFunctionOptions {
  name: string;
  /** When true, the API will append yourFunction(parameters, to, the, function). By default this is `datetime('{StartDate:o}')`. */
  makeFunctionCall: boolean;
  /** When true, the API will also append `datetime('{EndDate:o}')` to your function call.*/
  useEndDate: boolean;
  /** When true, the API will also append `{NumBuckets}, {Bucket}` to your function call.*/
  useSplitting: boolean;
  /** When provided, the API will use this for the number of buckets. */
  numberOfBuckets?: number | undefined;
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
    makeFunctionCall: true,
    useSplitting: false,
    useEndDate: false,
    numberOfBuckets: null,
  };

  private _isTimeAgnostic: boolean;

  public formControls = {
    name: new FormControl(KustoFunctionComponent.defaults.name, [
      Validators.required,
      StringValidators.trim,
    ]),
    makeFunctionCall: new FormControl(KustoFunctionComponent.defaults.makeFunctionCall),
    useEndDate: new FormControl(KustoFunctionComponent.defaults.useEndDate),
    useSplitting: new FormControl(KustoFunctionComponent.defaults.useSplitting),
    numberOfBuckets: new FormControl(KustoFunctionComponent.defaults.numberOfBuckets),
  };

  public formGroup = new FormGroup({
    name: this.formControls.name,
    makeFunctionCall: this.formControls.makeFunctionCall,
    useEndDate: this.formControls.useEndDate,
    useSplitting: this.formControls.useSplitting,
    numberOfBuckets: this.formControls.numberOfBuckets,
  });

  /** Gets a value indicating whether this is in "time agnostic" mode. */
  public get isTimeAgnostic(): boolean {
    return this._isTimeAgnostic;
  }

  /** Sets a value indicating whether this should be in "time agnostic" mode. */
  public set isTimeAgnostic(value: boolean) {
    this._isTimeAgnostic = value;
    if (this._isTimeAgnostic) {
      this.formControls.makeFunctionCall.setValue(false);
      this.formControls.useEndDate.setValue(false);
      this.formControls.useSplitting.setValue(false);
      this.formControls.numberOfBuckets.setValue(undefined);
      this.formControls.makeFunctionCall.disable();
      this.formControls.useEndDate.disable();
      this.formControls.useSplitting.disable();
      this.formControls.numberOfBuckets.disable();
    } else {
      this.formControls.makeFunctionCall.enable();
      this.formControls.useEndDate.enable();
      this.formControls.useSplitting.enable();
      this.formControls.numberOfBuckets.enable();
    }
  }

  constructor() {
    this.formGroup.valueChanges.subscribe(data => this.changeFn(data));
  }

  /** Form control hook. */
  public writeValue(data: KustoFunctionOptions): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });
      this.onMakeFunctionCallChanged(data.makeFunctionCall);
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

  /** Called when the Make Function Call checkbox is clicked. */
  public onMakeFunctionCallChanged(makeFunctionCall: boolean): void {
    if (makeFunctionCall) {
      this.formControls.useEndDate.enable();
      this.formControls.useSplitting.enable();
      this.formControls.numberOfBuckets.enable();
    } else {
      this.formControls.useEndDate.disable();
      this.formControls.useSplitting.disable();
      this.formControls.numberOfBuckets.disable();
    }
  }

  private changeFn = (_data: KustoFunctionOptions) => {
    /* Empty */
  };
}
