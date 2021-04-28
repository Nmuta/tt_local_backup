import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { DateTime } from 'luxon';

/** A directive for requiring a date-time form value be BEFORE a given date. */
@Directive({
  selector: '[afterDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AfterDateDirective, multi: true }],
})
export class AfterDateDirective implements Validator {
  /** Target date. */
  @Input() public afterDate: Date | DateTime;

  /** The date to use instead of this control's value. */
  @Input() public actualDate: Date | DateTime;

  /** Validator hook. */
  public validate(control: AbstractControl): ValidationErrors | null {
    const afterDate =
      this.afterDate instanceof Date ? DateTime.fromJSDate(this.afterDate as Date) : this.afterDate;

    const actualDate =
      this.actualDate instanceof Date
        ? DateTime.fromJSDate(this.actualDate as Date)
        : this.actualDate;

    const value = actualDate ?? DateTime.fromISO(control.value);
    const isAfterDate = value > afterDate;
    if (!isAfterDate) {
      return { ['after-date']: true };
    }

    return null;
  }
}
