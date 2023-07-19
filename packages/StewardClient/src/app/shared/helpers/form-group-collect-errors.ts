import { AbstractControl, FormGroup } from '@angular/forms';

// https://stackoverflow.com/questions/40680321/get-all-validation-errors-from-angular-2-formgroup

/** True if this control is a form group. */
export function isFormGroup(control: AbstractControl): control is FormGroup {
  return !!(<FormGroup>control).controls;
}

/** Recursively returns all the errors from a given form group. */
export function collectErrors(control: AbstractControl): unknown | null {
  if (isFormGroup(control)) {
    return Object.entries(control.controls).reduce((acc, [key, childControl]) => {
      const childErrors = collectErrors(childControl);
      if (childErrors) {
        acc = { ...acc, [key]: childErrors };
      }
      return acc;
    }, null);
  } else {
    return control.errors;
  }
}
