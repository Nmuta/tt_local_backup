import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { chain, clone, isEqual, keys } from 'lodash';

export type ToggleListOptions = Record<string, boolean>;

/** Wrapper around toggle states. */
@Component({
  selector: 'toggle-list',
  templateUrl: './toggle-list.component.html',
  styleUrls: ['./toggle-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ToggleListComponent),
      multi: true,
    },
  ],
})
export class ToggleListComponent implements OnChanges, ControlValueAccessor, Validator {
  @Input() public order: string[] = [];
  @Input() public initial: Record<string, boolean> = {};
  public current: Record<string, boolean> = {};

  public formControls: Record<string, FormControl> = {};

  public formGroup = new FormGroup(this.formControls);

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    const initialKeys = keys(this.initial);
    const initialKeysLookup = new Set(initialKeys);
    const lengthsMatch = initialKeys.length == this.order.length;

    const allExpectedKeysFound = this.order.every(k => initialKeysLookup.has(k));
    if (!(lengthsMatch && allExpectedKeysFound)) {
      throw new Error('Initial keys and Order do not have same values.');
    }

    this.current = clone(this.initial);
    this.formControls = chain(initialKeys)
      .map(k => [k, new FormControl(this.initial[k])])
      .fromPairs()
      .value();
    this.formGroup = new FormGroup(this.formControls);

    this.formGroup.valueChanges.subscribe(_ => this.changeFn(this.formGroup.value));
  }

  /** Form control hook. */
  public writeValue(data: ToggleListOptions): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });
      if (isEqual(data, this.initial)) {
        this.formGroup.markAsPristine();
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: ToggleListOptions) => void): void {
    this.changeFn = fn;
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

  private changeFn = (_data: ToggleListOptions) => {
    // empty
  };
}
