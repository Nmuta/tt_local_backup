import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MessageOfTheDayComponent } from './message-of-the-day.component';
import { MessageOfTheDayRouterModule } from './message-of-the-day.routing';
import { SteelheadMessageOfTheDayComponent } from './steelhead/steelhead-message-of-the-day.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { LocalizationModule } from '@components/localization/localization.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@shared/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { LuxonDateModule } from 'ngx-material-luxon';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { LuxonModule } from 'luxon-angular';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { ActivePullRequestsModule } from '@views/active-pull-requests/active-pull-requests.module';

/** Module for displaying message of the day tool. */
@NgModule({
  declarations: [MessageOfTheDayComponent, SteelheadMessageOfTheDayComponent],
  imports: [
    MessageOfTheDayRouterModule,
    CommonModule,
    MatTabsModule,
    LocalizationModule,
    EndpointSelectionModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MonitorActionModule,
    StateManagersModule,
    PipesModule,
    MatOptionModule,
    MatSelectModule,
    DateTimePickersModule,
    LuxonDateModule,
    StandardDateModule,
    MatDatepickerModule,
    PermissionsModule,
    LuxonModule,
    VerifyButtonModule,
    ActivePullRequestsModule,
  ],
  exports: [],
})
export class MessageOfTheDayModule {}
