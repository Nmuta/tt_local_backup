import { AbstractControl, ValidatorFn } from '@angular/forms';
import { trim } from 'lodash';

/** Common string validators. */
export class StringValidators {
  /** Verifies that trimming the value string does not change it. */
  public static readonly trim: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    const trimmedValue = trim(value);
    if (value === trimmedValue) {
      return null;
    }

    return { trim: true };
  };
}
