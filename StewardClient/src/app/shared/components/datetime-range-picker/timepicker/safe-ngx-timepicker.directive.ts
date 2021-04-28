import { Directive, Input } from '@angular/core';
import moment from 'moment';
import { NgxMaterialTimepickerComponent, TimepickerDirective } from 'ngx-material-timepicker';

/** A safer version of the [ngxTimepicker] directive */
@Directive({
  selector: '[safeNgxTimepicker]',
})
export class SafeNgxTimepickerDirective extends TimepickerDirective {
  private useFallbackValue = false;
  private fallbackValue = super.value;

  /** Override the value setter. */
  @Input()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TS2611 This override of an accessor is intentional and works correctly. Produces compile-time error in TS4.x.x despite working fine.
  public set value(value: string) {
    const strictParsed = moment.utc(value, 'HH:mm', true);
    if (strictParsed.isValid()) {
      this.useFallbackValue = false;
      super.value = value;
    } else {
      this.useFallbackValue = true;
      this.fallbackValue = value;
    }
  }

  /** Override the value setter. */
  public get value(): string {
    if (this.useFallbackValue) {
      return this.fallbackValue;
    }

    return super.value;
  }

  /** Override the primary input. */
  @Input()
  public set safeNgxTimepicker(picker: NgxMaterialTimepickerComponent) {
    super.timepicker = picker;
  }
}
