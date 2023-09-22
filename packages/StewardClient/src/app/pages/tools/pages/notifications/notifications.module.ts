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
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { NotificationsRoutingModule } from './notifications.routing';
import { LspGroupSelectionModule } from '@shared/views/lsp-group-selection/lsp-group-selection.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NotificationsComponent } from './notifications.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { SunriseNotificationsComponent } from './sunrise/sunrise-notifications.component';
import { WoodstockNotificationsComponent } from './woodstock/woodstock-notifications.component';
import { CommunityMessagingModule } from './components/community-messaging/community-messaging.module';
import { GroupNotificationManagementModule } from './components/notification-management/group-notification-management/group-notification-management.module';
import { IndividualNotificationManagementModule } from './components/notification-management/individual-notification-management/individual-notification-management.module';
import { SteelheadNotificationsComponent } from './steelhead/steelhead-notifications.component';
import { LocalizedMessagingModule } from './components/localized-messaging/localized-messaging.module';
import { LocalizationModule } from '@components/localization/localization.module';
import { LocalizedIndividualNotificationManagementModule } from './components/notification-management/localized-individual-notification-management/localized-individual-notification-management.module';
import { LocalizedGroupNotificationManagementModule } from './components/notification-management/localized-group-notification-management/localized-group-notification-management.module';
import { ActivePullRequestsModule } from '@views/active-pull-requests/active-pull-requests.module';

/** Routed module for viewing steward user history. */
@NgModule({
  declarations: [
    NotificationsComponent,
    SunriseNotificationsComponent,
    WoodstockNotificationsComponent,
    SteelheadNotificationsComponent,
  ],
  imports: [
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
    PlayerSelectionModule,
    LspGroupSelectionModule,
    NotificationsRoutingModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    CommunityMessagingModule,
    LocalizedMessagingModule,
    GroupNotificationManagementModule,
    IndividualNotificationManagementModule,
    LocalizationModule,
    LocalizedIndividualNotificationManagementModule,
    LocalizedGroupNotificationManagementModule,
    ActivePullRequestsModule,
  ],
})
export class NotificationsModule {}
