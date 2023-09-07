import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { DateTime } from 'luxon';

/** A routed component for demonstrating icons. */
@Component({
  templateUrl: './datetime-picker-demo.component.html',
  styleUrls: ['./datetime-picker-demo.component.scss'],
})
export class DateTimePickerDemoComponent {
  public formControls = {
    demoDateUtc: new UntypedFormControl(DateTime.utc(), [Validators.required]),
  };
}
