import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export function isAfterDateValidator(minDate: moment.Moment): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const selectedDate = moment(value);
    return !(selectedDate.diff(minDate) > 0) ? { pastDate: true } : null;
  };
}
