import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { LocalizedIndividualNotificationManagementComponent } from './localized-individual-notification-management.component';
import { LuxonDateModule } from '@angular/material-luxon-adapter';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { LocalizationModule } from '@components/localization/localization.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** Routed module for viewing steward user history. */
@NgModule({
  declarations: [LocalizedIndividualNotificationManagementComponent],
  imports: [
    ...STANDARD_DATE_IMPORTS,
    CommonModule,
    DirectivesModule,
    FontAwesomeModule,
    FormsModule,
    JsonDumpModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MonitorActionModule,
    StateManagersModule,
    PipesModule,
    ReactiveFormsModule,
    MakeModelAutocompleteModule,
    EndpointSelectionModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    DateTimePickersModule,
    LuxonDateModule,
    StandardDateModule,
    LocalizationModule,
    PermissionsModule,
  ],
  exports: [LocalizedIndividualNotificationManagementComponent],
})
export class LocalizedIndividualNotificationManagementModule {}
