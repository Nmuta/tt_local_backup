import { Component, ContentChild, forwardRef, Input, TemplateRef } from '@angular/core';
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
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { isEqual } from 'lodash';
import { map, pairwise, startWith, takeUntil } from 'rxjs/operators';

export type OptionalNumberOptions = number | null;

export interface OptionalNumberOptionsInternal {
  useNumber: boolean;
  number: number;
}

/** A form component that emits either a number or null. */
@Component({
  selector: 'optional-number',
  templateUrl: './optional-number.component.html',
  styleUrls: ['./optional-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OptionalNumberComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OptionalNumberComponent),
      multi: true,
    },
  ],
})
export class OptionalNumberComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator {
  @ContentChild(TemplateRef) template: TemplateRef<unknown>;

  @Input() public label: string;

  @Input() public placeholder: string;

  /** Configures the minimum value. */
  @Input()
  public set min(value: number | null) {
    this._min = value;
    this.updateValidators();
  }

  /** Configures the minimum value. */
  public get min(): number | null {
    return this._min;
  }

  /** Configures the maximum value. */
  @Input()
  public set max(value: number | null) {
    this._max = value;
    this.updateValidators();
  }

  /** Configures the maximum value. */
  public get max(): number | null {
    return this._max;
  }

  /** The tooltip to display over the component. */
  public get tooltip(): string {
    if (this.formControls.useNumber.value) {
      return null;
    }

    return 'Check box to provide ' + this.label;
  }

  public formControls = {
    useNumber: new FormControl(false),
    number: new FormControl({ value: 0, disabled: true }),
  };

  public formGroup = new FormGroup({
    useNumber: this.formControls.useNumber,
    number: this.formControls.number,
  });

  private _min: number | null;
  private _max: number | null;

  constructor() {
    super();

    // when there are unstable changes, update the enabled state of the number control
    this.formGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$), startWith(this.formGroup.value), pairwise())
      .subscribe(([oldValue, newValue]) => {
        if (!isEqual(oldValue, newValue)) {
          if (newValue.useNumber) {
            this.formControls.number.enable();
          } else {
            this.formControls.number.disable();
          }

          this.formControls.useNumber.updateValueAndValidity();
        }
      });

    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        map(internalValue => this.makeValue(internalValue)),
      )
      .subscribe(data => this.changeFn(data));
  }

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: OptionalNumberOptions) => void): void {
    this.changeFn = fn;
    this.changeFn(this.makeValue(this.formGroup.value));
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

  private changeFn = (_data: OptionalNumberOptions) => {
    /* Empty */
  };

  private updateValidators(): void {
    const validators = [];
    if (this.min) {
      validators.push(Validators.min(this.min));
    }

    if (this.max) {
      validators.push(Validators.max(this.max));
    }

    this.formControls.number.setValidators(validators);
    this.formControls.number.updateValueAndValidity();
  }

  private makeValue(internalValue: OptionalNumberOptionsInternal): OptionalNumberOptions {
    if (internalValue.useNumber) {
      return internalValue.number;
    }

    return null;
  }
}