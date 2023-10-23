import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Check input is of type */
export class TypeValidator {
  private static isMatchingTypeError = 'Value is not of matching type';

  /** Check if input value matches input type */
  public static isMatchingType(emptyObject: object): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      if (typeof control.value === 'string') {
        return { isMatchingType: TypeValidator.isMatchingTypeError };
      }
      if (!control.value) {
        return null;
      }
      const typeKeys = Object.keys(emptyObject);
      return typeKeys.every(k => control.value.hasOwnProperty(k))
        ? null
        : {
            isMatchingType: TypeValidator.isMatchingTypeError,
          };
    };
  }
}
