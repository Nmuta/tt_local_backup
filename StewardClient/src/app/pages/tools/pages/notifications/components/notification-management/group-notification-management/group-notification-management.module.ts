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
import { SunriseGroupNotificationManagementComponent } from './sunrise/sunrise-group-notification-management.component';
import { WoodstockGroupNotificationManagementComponent } from './woodstock/woodstock-group-notification-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GroupNotificationManagementComponent } from './group-notification-management.component';
import { WoodstockGroupNotificationManagementContract } from './woodstock/woodstock-group-notification-management.contract';
import { SunriseGroupNotificationManagementContract } from './sunrise/sunrise-group-notification-management.contract';
import { SteelheadGroupNotificationManagementComponent } from './steelhead/steelhead-group-notification-management.component';
import { SteelheadGroupNotificationManagementContract } from './steelhead/steelhead-group-notification-management.contract';

/** Routed module for viewing steward user history. */
@NgModule({
  declarations: [
    GroupNotificationManagementComponent,
    SunriseGroupNotificationManagementComponent,
    WoodstockGroupNotificationManagementComponent,
    SteelheadGroupNotificationManagementComponent,
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
  ],
  exports: [
    GroupNotificationManagementComponent,
    SunriseGroupNotificationManagementComponent,
    WoodstockGroupNotificationManagementComponent,
    SteelheadGroupNotificationManagementComponent,
  ],
  providers: [
    SteelheadGroupNotificationManagementContract,
    WoodstockGroupNotificationManagementContract,
    SunriseGroupNotificationManagementContract,
  ],
})
export class GroupNotificationManagementModule {}
