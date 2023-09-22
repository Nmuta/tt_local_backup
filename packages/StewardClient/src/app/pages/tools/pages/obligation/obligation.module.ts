import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DataPipelineObligationComponent } from './obligation.component';
import { DataPipelineObligationRoutingModule } from './obligation.routing';
import { MatIconModule } from '@angular/material/icon';
import { FullObligationInputComponent } from './components/full-obligation-input/full-obligation-input.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ObligationsService } from '@services/obligations';
import { KustoDataActivityComponent } from './components/kusto-data-activities/kusto-data-activity/kusto-data-activity.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { KustoDataActivitiesComponent } from './components/kusto-data-activities/kusto-data-activities.component';
import { KustoFunctionComponent } from './components/kusto-data-activities/kusto-function/kusto-function.component';
import { OptionalNumberModule } from '@components/optional-number/optional-number.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { DependencyListComponent } from './components/dependency-list/dependency-list.component';
import { ObligationPrincipalsComponent } from './components/obligation-principals/obligation-principals.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { RestateOMaticComponent } from './components/kusto-data-activities/restate-o-matic/restate-o-matic.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { DirectivesModule } from '@shared/directives/directives.module';
import { BundleComponent } from './components/kusto-data-activities/bundle/bundle.component';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** Module for displaying the data pipeline obligation page. */
@NgModule({
  declarations: [
    DataPipelineObligationComponent,
    FullObligationInputComponent,
    KustoDataActivityComponent,
    KustoDataActivitiesComponent,
    KustoFunctionComponent,
    DependencyListComponent,
    ObligationPrincipalsComponent,
    RestateOMaticComponent,
    BundleComponent,
  ],
  providers: [ObligationsService],
  imports: [
    CommonModule,
    DataPipelineObligationRoutingModule,
    DateTimePickersModule,
    DirectivesModule,
    FontAwesomeModule,
    FormsModule,
    JsonDumpModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MonitorActionModule,
    OptionalNumberModule,
    StateManagersModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    TextFieldModule,
    VerifyButtonModule,
    PermissionsModule,
  ],
  exports: [DataPipelineObligationComponent],
})
export class DataPipelineObligationModule {}
