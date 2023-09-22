import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
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
    NgxMaterialTimepickerModule.setOpts('en-US'),
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
