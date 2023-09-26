import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { RouterModule } from '@angular/router';
import { CarDetailsRoutingModule } from './car-details.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { CarDetailsComponent } from './car-details.component';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { WoodstockSelectCarDetailsComponent } from './components/select-car-details/woodstock/woodstock-select-car-details.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { LuxonModule } from 'luxon-angular';
import { HelpModule } from '@shared/modules/help/help.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { StandardFlagModule } from '@components/standard-flag/standard-flag.module';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { WoodstockCarDetailsComponent } from './components/car-details/woodstock/woodstock-car-details.component';
import { ModelDumpModule } from '@shared/modules/model-dump/model-dump.module';

/** Module for displaying car details tools. */
@NgModule({
  declarations: [
    CarDetailsComponent,
    WoodstockSelectCarDetailsComponent,
    WoodstockCarDetailsComponent,
  ],
  imports: [
    CarDetailsRoutingModule,
    CommonModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    MonitorActionModule,
    EndpointSelectionModule,
    StateManagersModule,
    StandardDateModule,
    StandardCopyModule,
    PipesModule,
    LuxonModule,
    DateTimePickersModule,
    HelpModule,
    StandardFlagModule,
    MakeModelAutocompleteModule,
    ModelDumpModule,
  ],
  exports: [],
})
export class CarDetailsModule {}
