import { FormControl, FormGroup } from '@angular/forms';

/** Gets a form control from a given form-group based on an underlying type. */
export function getFormControl<T, K extends keyof T>(formGroup: FormGroup, key: K): FormControl {
  return formGroup.controls[key as string] as FormControl;
}

/** Gets a value from a form-control within a given form-group based on an underlying type. */
export function getFormValue<T, K extends keyof T>(formGroup: FormGroup, key: K): T[K] {
  return getFormControl<T, K>(formGroup, key).value as T[K];
}
