import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import BigNumber from 'bignumber.js';

/** Common BigNumber validators. */
export class BigNumberValidators {
  /** Ensures the input is a BigNumber. */
  public static isBigNumber(): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      const value: string = control.value;

      if (!!value && value.trim() !== '') {
        const bigNumber = new BigNumber(value);
        if (bigNumber.isNaN()) {
          return { isNan: `${bigNumber} is not a valid BigNumber` };
        }
      }

      return null;
    };
  }
}
