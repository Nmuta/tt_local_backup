import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DatetimePickerComponent } from './datetime-picker/datetime-picker.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { DatetimeRangePickerComponent } from './datetime-range-picker/datetime-range-picker.component';
import { SafeNgxTimepickerDirective } from './timepicker/safe-ngx-timepicker.directive';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DateRangePickerComponent } from './datetime-range-picker/date-range-picker/date-range-picker.component';

/** A utility module that exports a datetime picker component for forms. */
@NgModule({
  declarations: [
    DatetimePickerComponent,
    TimepickerComponent,
    SafeNgxTimepickerDirective,
    DateRangePickerComponent,
    DatetimeRangePickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    DirectivesModule,
    MatLuxonDateModule,
    PipesModule,
    NgxMaterialTimepickerModule.setLocale('en-US'),
  ],
  exports: [
    DatetimePickerComponent,
    TimepickerComponent,
    SafeNgxTimepickerDirective,
    DateRangePickerComponent,
    DatetimeRangePickerComponent,
  ],
})
export class DateTimePickersModule {}
