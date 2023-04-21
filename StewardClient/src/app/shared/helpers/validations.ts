import { FormControl, ValidationErrors } from '@angular/forms';
import _ from 'lodash';

/** Verify that the value is part of the parent banReasons list. */
export function requireReasonListMatch(control: FormControl): ValidationErrors | null {
  const selection = control.value;

  if (!_.includes(this.banReasons, selection)) {
    return { requireReasonListMatch: true };
  }

  return null;
}
