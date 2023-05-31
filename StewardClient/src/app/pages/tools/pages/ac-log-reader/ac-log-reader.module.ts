import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { OverviewModule } from '@shared/views/overview/overview.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '@shared/directives/directives.module';
import { AcLogReaderComponent } from './ac-log-reader.component';
import { AcLogReaderRouterModule } from './ac-log-reader.routing';
import { SteelheadAcLogReaderComponent } from './steelhead/steelhead-ac-log-reader.component';
import { AcLogReaderBaseComponent } from './base/ac-log-reader.base.component';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
/** The feature module for the AC Log Reader route. */
@NgModule({
  declarations: [AcLogReaderComponent, AcLogReaderBaseComponent, SteelheadAcLogReaderComponent],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    AcLogReaderRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    CommonModule,
    PipesModule,
    OverviewModule,
    JsonDumpModule,
    MatTooltipModule,
    EndpointSelectionModule,
    MonitorActionModule,
    StateManagersModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    DirectivesModule,
    PermissionsModule,
  ],
})
export class AcLogReaderModule {}
