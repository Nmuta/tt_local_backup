import { Pipe, PipeTransform } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { collectErrors } from '@helpers/form-group-collect-errors';

/**
 * Collects all errors from the given form group.
 * https://stackoverflow.com/questions/40680321/get-all-validation-errors-from-angular-2-formgroup
 */
@Pipe({
  name: 'formGroupErrors',
  pure: false,
})
export class FormGroupErrorsPipe implements PipeTransform {
  /** The transform. */
  public transform(value: UntypedFormGroup): unknown {
    return collectErrors(value);
  }
}
