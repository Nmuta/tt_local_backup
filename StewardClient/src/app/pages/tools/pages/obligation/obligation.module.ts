import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataPipelineObligationComponent } from './obligation.component';
import { DataPipelineObligationRoutingModule } from './obligation.routing';
import { MatIconModule } from '@angular/material/icon';
import { FullObligationInputComponent } from './components/full-obligation-input/full-obligation-input.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ObligationsService } from '@services/obligations';
import { KustoDataActivityComponent } from './components/kusto-data-activities/kusto-data-activity/kusto-data-activity.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { KustoDataActivitiesComponent } from './components/kusto-data-activities/kusto-data-activities.component';
import { KustoFunctionComponent } from './components/kusto-data-activities/kusto-function/kusto-function.component';
import { OptionalNumberModule } from '@components/optional-number/optional-number.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DependencyListComponent } from './components/dependency-list/dependency-list.component';
import { ObligationPrincipalsComponent } from './components/obligation-principals/obligation-principals.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { RestateOMaticComponent } from './components/kusto-data-activities/restate-o-matic/restate-o-matic.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DirectivesModule } from '@shared/directives/directives.module';
import { BundleComponent } from './components/kusto-data-activities/bundle/bundle.component';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';

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
    VerifyCheckboxModule,
  ],
  exports: [DataPipelineObligationComponent],
})
export class DataPipelineObligationModule {}
