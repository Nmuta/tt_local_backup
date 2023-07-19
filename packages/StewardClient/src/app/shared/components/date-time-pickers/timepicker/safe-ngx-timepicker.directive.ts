import { Directive, Input, OnChanges } from '@angular/core';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { DateTime } from 'luxon';
import { NgxMaterialTimepickerComponent, TimepickerDirective } from 'ngx-material-timepicker';

/** A safer version of the [ngxTimepicker] directive */
@Directive({
  selector: '[safeNgxTimepicker]',
})
export class SafeNgxTimepickerDirective extends TimepickerDirective implements OnChanges {
  private useFallbackValue = false;
  private fallbackValue = super.value;

  /** Override the value setter. */
  @Input()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TS2611 This override of an accessor is intentional and works correctly. Produces compile-time error in TS4.x.x despite working fine.
  public set value(value: string) {
    try {
      const strictParsed = DateTime.fromFormat(value, 'HH:mm', { zone: 'utc' });
      if (strictParsed.isValid) {
        this.useFallbackValue = false;
        super.value = value;
        return;
      }
    } catch (ex) {
      // ignore failures
    }

    this.useFallbackValue = true;
    this.fallbackValue = value;
  }

  /** Override the value getter. */
  public get value(): string {
    if (this.useFallbackValue) {
      return this.fallbackValue;
    }

    return super.value;
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<SafeNgxTimepickerDirective>): void {
    if (this.fallbackValue) {
      return;
    }

    super.ngOnChanges(changes);
  }

  /** Override the primary input. */
  @Input()
  public set safeNgxTimepicker(picker: NgxMaterialTimepickerComponent) {
    super.timepicker = picker;
  }
}
