import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import BigNumber from 'bignumber.js';
import { find } from 'lodash';

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

  /** Ensures the input is not any of the values provided. */
  public static cannotBe(cannotBeValues: (BigNumber | number)[]): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      const value = new BigNumber(control.value);
      const cannotBeValueAsBigNumbers = cannotBeValues.map(v => {
        const isBigNumber = BigNumber.isBigNumber(v);
        return isBigNumber ? (v as BigNumber) : new BigNumber(v);
      });

      if (!!find(cannotBeValueAsBigNumbers, cannotBe => cannotBe.isEqualTo(value))) {
        return { cannotBe: `The input cannot be ${value.toString()}` };
      }

      return null;
    };
  }
}
