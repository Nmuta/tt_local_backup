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

/** Verify that the value is part of the parent cars list. */
export function requireValidCarSelection(control: FormControl): ValidationErrors | null {
  const selection = control.value;

  if (!selection?.id) {
    return { requireValidCarSelection: true };
  }

  const valid = this.allCars.find(car => car.id.isEqualTo(selection.id));

  if (valid) {
    return null;
  }

  return { requireValidCarSelection: true };
}
