import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { DateTime } from 'luxon';

/** A directive for requiring a date-time form value be BEFORE a given date. */
@Directive({
  selector: '[beforeDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: BeforeDateDirective, multi: true }],
})
export class BeforeDateDirective implements Validator {
  /** Target date. */
  @Input() public beforeDate: Date | DateTime;

  /** The date to use instead of this control's value. */
  @Input() public actualDate: Date | DateTime;

  /** Validator hook. */
  public validate(control: AbstractControl): ValidationErrors | null {
    const beforeDate =
      this.beforeDate instanceof Date
        ? DateTime.fromJSDate(this.beforeDate as Date)
        : this.beforeDate;

    const actualDate =
      this.actualDate instanceof Date
        ? DateTime.fromJSDate(this.actualDate as Date)
        : this.actualDate;

    const value = actualDate ?? DateTime.fromISO(control.value);
    const isBeforeDate = value < beforeDate;
    if (!isBeforeDate) {
      return { ['before-date']: true };
    }

    return null;
  }
}
