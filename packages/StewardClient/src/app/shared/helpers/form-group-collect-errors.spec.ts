import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { isFormGroup, collectErrors } from './form-group-collect-errors';

describe('Helper: form-group-collect-errors', () => {
  describe('Method: isFormGroup', () => {
    const isAFormGroup = new FormGroup({
      foo: new FormControl(false),
    });

    const isNotAFormGroup = new FormControl({});

    it('should correctly identify FormGroups', () => {
      const shouldBeTrue = isFormGroup(isAFormGroup);
      const shouldBeFalse = isFormGroup(isNotAFormGroup);

      expect(shouldBeTrue).toBeTruthy();
      expect(shouldBeFalse).toBeFalsy();
    });
  });

  describe('Method: collectErrors', () => {
    const formControl = new FormControl(false);
    formControl.setErrors({ invalid: true });

    const formGroup = new FormGroup({
      foo: formControl,
    });

    it('should collect errors', () => {
      const formGroupErrors = collectErrors(formGroup);
      const formControlErrors = collectErrors(formControl);

      expect((formGroupErrors as ValidationErrors)['foo'].invalid).toBeTruthy();
      expect((formControlErrors as ValidationErrors).invalid).toBeTruthy();
    });
  });
});
