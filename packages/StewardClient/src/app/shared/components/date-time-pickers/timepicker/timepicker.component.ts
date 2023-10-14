import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormBuilder,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { isNull, isUndefined } from 'lodash';
import { DateTime } from 'luxon';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/** An adaptation of ngx-material-timepicker that works well with form. */
@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TimepickerComponent,
    },
  ],
})
export class TimepickerComponent
  implements
    MatFormFieldControl<DateTime>,
    OnDestroy,
    ControlValueAccessor,
    Validator,
    AfterViewInit,
    OnChanges
{
  private static nextId = 0;

  @ViewChild('picker')
  public picker: NgxMaterialTimepickerComponent;

  /** The ID of this control. MatFormFieldControl hook. */
  @HostBinding()
  public id = `steward-timepicker-${TimepickerComponent.nextId++}`;

   /** If the time picked when converted wraps to UTC day +1, notify date picker */
   @Output() public bumpDay = new EventEmitter<unknown>();


  /** MatFormFieldControl hook. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby')
  public userAriaDescribedBy: string;

    /**
     get the corresponding timeSlot
     */
   // eslint-disable-next-line @angular-eslint/no-input-rename
   @Input('timeSlot') public timeSlot: string;

  /** Minimum datetime allowed. */
  @Input()
  public min: DateTime;
  public minFormatted: string;

  public _value: DateTime = DateTime.utc().startOf('day');
  public _valueInternal: string = this._value.toFormat('HH:mm');
  public startTimeIsNextDay: boolean = false;
  public endTimeIsNextDay: boolean = false;

  /** MatFormFieldControl hook. */
  public focused = false;

  /** MatFormFieldControl hook. */
  public get errorState(): boolean {
    if (this.ngControl?.disabled) {
      return false;
    }
    return !(this.ngControl?.valid ?? true);
  }

  /** MatFormFieldControl hook. */
  public controlType = 'steward-timepicker-input';

  /** MatFormFieldControl hook. */
  public stateChanges = new Subject<void>();

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  localTime = '';

  /** Gets or sets the value of the input. MatFormFieldControl hook. */
  @Input()
  public get value(): DateTime {
    return this._value;
  }

  /** Gets or sets the value of the input. MatFormFieldControl hook. */
  public set value(input: DateTime) {
    this._valueInternal = input.toFormat('HH:mm', { locale: 'utc' });
    this._value = DateTime.fromFormat(this._valueInternal, 'HH:mm', { zone: 'utc' });
    this.stateChanges.next();
  }

  /** Gets or sets the value of the input. Designed to translate for ngx-material-timepicker. */
  @Input()
  public get valueInternal(): string {
    return this._valueInternal;
  }

  /** Gets or sets the value of the input. Designed to translate for ngx-material-timepicker. */
  public set valueInternal(input: string) {
   
    const parsed = DateTime.fromFormat(input, 'HH:mm', { zone: 'utc' });
    if (parsed && parsed.isValid) {
      this._valueInternal = input;
      this._value = parsed;
    } else {
      this._valueInternal = input;
      this._value = null;
    }

    this.stateChanges.next();
  }

  /** Gets or sets the placeholder text. MatFormFieldControl hook. */
  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }

  /** Gets or sets the placeholder text. MatFormFieldControl hook. */
  public set placeholder(text: string) {
    this._placeholder = text;
    this.stateChanges.next();
  }

  /** MatFormFieldControl hook. */
  public get empty(): boolean {
    return isNull(this.value) || isUndefined(this.value);
  }

  /** MatFormFieldControl hook. */
  @HostBinding('class.floating')
  public get shouldLabelFloat(): boolean {
    return !!this.valueInternal || this.focused || !this.empty;
  }

  /** MatFormFieldControl hook. */
  @Input()
  public get required(): boolean {
    return this._required;
  }

  /** MatFormFieldControl hook. */
  public set required(input: boolean) {
    this._required = coerceBooleanProperty(input);
    this.stateChanges.next();
  }

  /** MatFormFieldControl hook. */
  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }

  /** MatFormFieldControl hook. */
  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  constructor(
    formBuilder: UntypedFormBuilder,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    /** The bound angular control. MatFormFieldControl hook. */
    @Optional() @Self() public ngControl: NgControl,
  ) {
    // avoid circular import by setting the NG_VALUE_ACCESSOR ourselves instead of using forwardRef
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    focusMonitor.monitor(elementRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    if (this.ngControl != null) {
      const newValidators = [c => this.validate(c)];
      if (this.ngControl.validator) {
        newValidators.push(this.ngControl.validator);
      }
      this.ngControl.control.setValidators(newValidators);
    }

    this.stateChanges.next();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.min) {
      this.minFormatted = null;
      return;
    }

    this.minFormatted = this.min.toLocaleString(DateTime.TIME_SIMPLE);
  }

  /** MatFormFieldControl hook. */
  public setDescribedByIds(ids: string[]): void {
    const controlElement = this.elementRef.nativeElement; // TODO: These might need to go on the input element to work right
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  /** MatFormFieldControl hook. */
  public onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elementRef.nativeElement.querySelector('input').focus();
    }
  }

  /** Angular lifecycle hook. */
  public ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.stateChanges.complete();
  }

  /** Form control hook. */
  public writeValue(data: DateTime): void {
    this.value = data;
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: DateTime) => void): void {
    this.stateChanges.pipe(map(_ => this.value)).subscribe(fn);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** triggered when the picker button is clicked. */
  public openPicker(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    this.picker.open();
    event.stopPropagation();
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    const aggregator = {};
    let hasError = false;
    if (this.value == null && !!this.valueInternal) {
      hasError = true;
      aggregator['bad-time'] = true;
    }

    if (this.value == null && !this.valueInternal) {
      hasError = true;
      aggregator['required'] = true;
    }

    return hasError ? aggregator : null;
  }

  /** Called when the value changes. */
  public onValueChange($event: string): void {
    this.valueInternal = $event;
    const local = this.translateToLocal($event);
    this.localTime = local;
  }

  /** Called when the dynamic value changes within the picker. */
  public onRealTimeValueChange($event: unknown): void {
    this.valueInternal = $event.toString();
    const local = this.translateToLocal($event.toString());
    this.localTime = local;
  }


  /** User chosen time should be local time for user. Add the UTC offset. */
  private translateToLocal(utcTime: string): string {
    
    const timeZoneOffset = new Date().getTimezoneOffset();

    const hoursDifference = Math.floor(timeZoneOffset/60);
    const minutesDifference = (timeZoneOffset % 60);

    const userChosenHour = parseInt(utcTime.split(':')[0]);
    const userChosenMinute = parseInt(utcTime.split(':')[1]);

    let suffix = '';

    let hours = userChosenHour-hoursDifference;

    if(hours < 0){
      hours = 24 - Math.abs(hours);
      suffix = ' (-1 day)';
    }

    const hoursString = this.leftPadTimeValue(`${hours}`);
    const minutesString = this.leftPadTimeValue(userChosenMinute+minutesDifference);

    const result= `${hoursString}:${minutesString}` + ' local time' + suffix; 
    return result;
  } 

  private leftPadTimeValue(val): string{
    return val.toString().padStart(2,'0');
  }


}
