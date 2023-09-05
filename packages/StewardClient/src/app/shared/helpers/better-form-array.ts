import { AbstractControl, UntypedFormArray } from '@angular/forms';

/** A FormArray that is typed. */
export class BetterFormArray<T extends AbstractControl> extends UntypedFormArray {
  controls: T[];
}
