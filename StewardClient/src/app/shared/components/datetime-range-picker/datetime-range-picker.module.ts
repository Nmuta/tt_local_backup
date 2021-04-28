import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimeRangePickerComponent } from './datetime-range-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInputModule } from '@angular/material/input';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SafeNgxTimepickerDirective } from './timepicker/safe-ngx-timepicker.directive';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLuxonDateModule } from 'ngx-material-luxon';

/** A utility module that exports a datetime picker component for forms. */
@NgModule({
  declarations: [DatetimeRangePickerComponent, TimepickerComponent, SafeNgxTimepickerDirective],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    DirectivesModule,
    MatLuxonDateModule,
    NgxMaterialTimepickerModule.setLocale('en-US'),
  ],
  exports: [DatetimeRangePickerComponent],
})
export class DatetimeRangePickerModule {}
