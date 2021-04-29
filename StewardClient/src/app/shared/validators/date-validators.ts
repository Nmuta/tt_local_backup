import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

/** Validators relating to dates. */
export class DateValidators {
  /** Requires the set date to be after a given date. */
  public static isAfter(minDate: moment.Moment): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const selectedDate = moment(value);
      return !(selectedDate.diff(minDate) > 0) ? { 'is-after': { minDate } } : null;
    };
  }
}
