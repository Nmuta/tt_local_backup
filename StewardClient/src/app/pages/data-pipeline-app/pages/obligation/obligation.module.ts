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
import { DatetimeRangePickerModule } from '@components/datetime-range-picker/datetime-range-picker.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ObligationsService } from '@services/obligations';
import { ObligationDataActivityComponent } from './components/obligation-data-activities/obligation-data-activity/obligation-data-activity.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ObligationDataActivitiesComponent } from './components/obligation-data-activities/obligation-data-activities.component';
import { KustoFunctionComponent } from './components/kusto-function/kusto-function.component';
import { OptionalNumberModule } from '@components/optional-number/optional-number.module';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DependencyListComponent } from './components/dependency-list/dependency-list.component';
import { ObligationPrincipalsComponent } from './components/obligation-principals/obligation-principals.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

/** Module for displaying the data pipeline obligation page. */
@NgModule({
  declarations: [
    DataPipelineObligationComponent,
    FullObligationInputComponent,
    ObligationDataActivityComponent,
    ObligationDataActivitiesComponent,
    KustoFunctionComponent,
    DependencyListComponent,
    ObligationPrincipalsComponent,
  ],
  providers: [ObligationsService],
  imports: [
    DataPipelineObligationRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    DatetimeRangePickerModule,
    PipesModule,
    MatExpansionModule,
    OptionalNumberModule,
    VerifyActionButtonModule,
    MonitorActionModule,
    VerifyCheckboxModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatSelectModule,
  ],
  exports: [DataPipelineObligationComponent],
})
export class DataPipelineObligationModule {}
