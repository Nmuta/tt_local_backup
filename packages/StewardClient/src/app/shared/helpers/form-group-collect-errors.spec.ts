import { UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { isFormGroup, collectErrors } from './form-group-collect-errors';

describe('Helper: form-group-collect-errors', () => {
  describe('Method: isFormGroup', () => {
    const isAFormGroup = new UntypedFormGroup({
      foo: new UntypedFormControl(false),
    });

    const isNotAFormGroup = new UntypedFormControl({});

    it('should correctly identify FormGroups', () => {
      const shouldBeTrue = isFormGroup(isAFormGroup);
      const shouldBeFalse = isFormGroup(isNotAFormGroup);

      expect(shouldBeTrue).toBeTruthy();
      expect(shouldBeFalse).toBeFalsy();
    });
  });

  describe('Method: collectErrors', () => {
    const formControl = new UntypedFormControl(false);
    formControl.setErrors({ invalid: true });

    const formGroup = new UntypedFormGroup({
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
