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
import { OverrideManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { NotificationManagementComponent } from './notification-management.component';
import { SunriseNotificationManagementComponent } from './sunrise/sunrise-notification-management.component';
import { WoodstockNotificationManagementComponent } from './woodstock/woodstock-notification-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PlayerSelectionModule } from '@navbar-app/components/player-selection/player-selection.module';
import { NotificationManagementRoutingModule } from './notification-management.routing';
import { LspGroupSelectionModule } from '@navbar-app/components/lsp-group-selection/lsp-group-selection.module';
import { MatSelectModule } from '@angular/material/select';
import { NotificationManagementBaseComponent } from './base/notification-management.base.component';
import { LuxonModule } from 'luxon-angular';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

/** Routed module for viewing steward user history. */
@NgModule({
  declarations: [
    NotificationManagementComponent,
    NotificationManagementBaseComponent,
    SunriseNotificationManagementComponent,
    WoodstockNotificationManagementComponent,
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
    OverrideManagersModule,
    PipesModule,
    ReactiveFormsModule,
    MakeModelAutocompleteModule,
    EndpointSelectionModule,
    MatTabsModule,
    PlayerSelectionModule,
    LspGroupSelectionModule,
    NotificationManagementRoutingModule,
    MatOptionModule,
    MatSelectModule,
    LuxonModule,
    MatLuxonDateModule,
    MatTooltipModule,
    MatPaginatorModule,
  ],
})
export class NotificationManagementModule {}
