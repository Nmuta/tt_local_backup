import { AbstractControl, FormArray } from '@angular/forms';

/** A FormArray that is typed. */
export class BetterFormArray<T extends AbstractControl> extends FormArray {
  controls: T[];
}
