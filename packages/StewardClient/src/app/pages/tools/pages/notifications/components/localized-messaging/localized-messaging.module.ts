import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { JsonTableResultsModule } from '@components/json-table-results/json-table-results.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { NewLocalizedMessageComponent } from './components/new-localized-message/new-localized-message.component';
import { LocalizedMessagingComponent } from './localized-messaging.component';
import { LocalizationModule } from '@components/localization/localization.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** Routed module for banning users. */
@NgModule({
  declarations: [NewLocalizedMessageComponent, LocalizedMessagingComponent],
  imports: [
    ...STANDARD_DATE_IMPORTS,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatChipsModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatTabsModule,
    MatIconModule,
    TextFieldModule,
    JsonTableResultsModule,
    DateTimePickersModule,
    StandardDateModule,
    LocalizationModule,
    StateManagersModule,
    PermissionsModule,
  ],
  exports: [NewLocalizedMessageComponent, LocalizedMessagingComponent],
})
export class LocalizedMessagingModule {}
