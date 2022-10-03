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
  implements ControlValueAccessor, Validator
{
  @ContentChild(TemplateRef) template: TemplateRef<unknown>;

  /** REVIEW-COMMENT: Label. */
  @Input() public label: string;

  /** REVIEW-COMMENT: Placeholder. */
  @Input() public placeholder: string;

  /** REVIEW-COMMENT: Configures the minimum value. */
  @Input()
  public set min(value: number | null) {
    this._min = value;
    this.updateValidators();
  }

  /** Configures the minimum value. */
  public get min(): number | null {
    return this._min;
  }

  /** REVIEW-COMMENT: Configures the maximum value. */
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
      .pipe(startWith(this.formGroup.value), pairwise(), takeUntil(this.onDestroy$))
      .subscribe(([oldValue, newValue]) => {
        if (!isEqual(oldValue, newValue)) {
          this.syncEnabledState(newValue);
        }
      });

    this.formGroup.valueChanges
      .pipe(
        map(internalValue => this.makeValue(internalValue)),
        takeUntil(this.onDestroy$),
      )
      .subscribe(data => this.changeFn(data));
  }

  /** Form control hook. */
  public writeValue(data: OptionalNumberOptions): void {
    if (data) {
      const internalValue = this.makeInternal(data);
      this.formGroup.patchValue(internalValue, { emitEvent: false });
      this.syncEnabledState(internalValue);
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

  private syncEnabledState(internalValue: OptionalNumberOptionsInternal): void {
    if (internalValue.useNumber) {
      this.formControls.number.enable();
    } else {
      this.formControls.number.disable();
    }

    this.formControls.useNumber.updateValueAndValidity();
  }

  private makeValue(internalValue: OptionalNumberOptionsInternal): OptionalNumberOptions {
    if (internalValue.useNumber) {
      return internalValue.number;
    }

    return null;
  }

  private makeInternal(externalValue: OptionalNumberOptions): OptionalNumberOptionsInternal {
    if (!externalValue) {
      return { useNumber: false, number: undefined };
    }

    return { useNumber: true, number: externalValue };
  }
}
