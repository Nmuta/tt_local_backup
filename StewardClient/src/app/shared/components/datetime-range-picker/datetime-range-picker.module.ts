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
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';

/** A utility module that exports a datetime picker component for forms. */
@NgModule({
  declarations: [
    DatetimeRangePickerComponent,
    DateRangePickerComponent,
    TimepickerComponent,
    SafeNgxTimepickerDirective,
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
    NgxMaterialTimepickerModule.setLocale('en-US'),
    PipesModule,
  ],
  exports: [DatetimeRangePickerComponent, DateRangePickerComponent],
})
export class DatetimeRangePickerModule {}
