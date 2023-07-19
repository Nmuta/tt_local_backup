import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { SunriseIndividualNotificationManagementComponent } from './sunrise/sunrise-individual-notification-management.component';
import { WoodstockIndividualNotificationManagementComponent } from './woodstock/woodstock-individual-notification-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IndividualNotificationManagementComponent } from './individual-notification-management.component';
import { LuxonDateModule } from 'ngx-material-luxon';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** Routed module for viewing steward user history. */
@NgModule({
  declarations: [
    IndividualNotificationManagementComponent,
    SunriseIndividualNotificationManagementComponent,
    WoodstockIndividualNotificationManagementComponent,
  ],
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
    PermissionsModule,
  ],
  exports: [
    IndividualNotificationManagementComponent,
    SunriseIndividualNotificationManagementComponent,
    WoodstockIndividualNotificationManagementComponent,
  ],
})
export class IndividualNotificationManagementModule {}
