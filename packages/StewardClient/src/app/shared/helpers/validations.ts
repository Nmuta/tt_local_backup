import { UntypedFormControl, ValidationErrors } from '@angular/forms';
import _ from 'lodash';

/** Verify that the value is part of the parent banReasons list. */
export function requireReasonListMatch(control: UntypedFormControl): ValidationErrors | null {
  const selection = control.value;

  // The calling class must have a string[] variable of all ban reasons.
  if (!_.includes(this.banReasons, selection)) {
    return { requireReasonListMatch: true };
  }

  return null;
}

/** Verify that the value is part of the parent cars list. */
export function requireValidCarSelection(control: UntypedFormControl): ValidationErrors | null {
  const selection = control.value;

  if (!selection?.id) {
    return { requireValidCarSelection: true };
  }

  /**
   * This will return true if the selected ID matches a valid car ID in Woodstock
   * The calling class must have a SimpleCar[] variable named allCars filled with
   * all of the valid cars in Woodstock.
   */
  const valid = this.allCars.find(car => car.id.isEqualTo(selection.id));

  if (valid) {
    return null;
  }

  return { requireValidCarSelection: true };
}
