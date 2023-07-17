import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { cloneDeep, filter, isEqual, trim } from 'lodash';

/** Common string validators. */
export class StringValidators {
  /** Ensures the current value is unique in the given list. */
  public static uniqueInList(getList: () => string[]): ValidatorFn {
    let _lastValue = undefined;

    return function (control: AbstractControl): ValidationErrors | null {
      const value = control.value;
      const lastValue = _lastValue;
      _lastValue = value;

      const outdatedList = getList();
      const list = cloneDeep(outdatedList);
      list.splice(list.indexOf(lastValue), 1, value);

      const matchingInList = filter(list, v => isEqual(v, value));
      const countInList = matchingInList.length;

      if (countInList > 1) {
        return { uniqueInList: { multiple: true, count: countInList, list } };
      }

      return null;
    };
  }

  /** Ensures the current value exists in the given list. */
  public static existsInList(getList: () => string[]): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      const list = getList();
      const value = control.value;
      if (list.includes(value)) {
        return null;
      }

      return { existsInList: list };
    };
  }

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
