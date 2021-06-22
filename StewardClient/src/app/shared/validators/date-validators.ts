import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

/** Validators relating to dates. */
export class DateValidators {
  /** Requires the set date to be after a given date. */
  public static isAfter(minDate: DateTime): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      let selectedDate: DateTime = null;
      if (value instanceof DateTime) {
        selectedDate = value;
      } else if (value instanceof Date) {
        selectedDate = DateTime.fromJSDate(value);
      } else if (typeof value === 'string') {
        selectedDate = DateTime.fromISO(value as string);
        if (!selectedDate.isValid) {
          return { 'invalid-format': value };
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const typeName = (value as object).constructor.name;
        throw new Error(`Invalid isAfter value received. Type: ${typeName}. Value: ${value}`);
      }

      if (selectedDate.diff(minDate).valueOf() > 0) {
        return null;
      }

      return {
        'is-after': {
          minDate,
          value,
        },
      };
    };
  }
}
