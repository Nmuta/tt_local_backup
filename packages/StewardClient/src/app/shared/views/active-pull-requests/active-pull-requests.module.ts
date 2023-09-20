import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { ActivePullRequestsComponent } from './active-pull-requests.component';
import { SteelheadActivePullRequestsComponent } from './steelhead/steelhead-active-pull-requests.component';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

/** Module for getting and setting a player's cms override. */
@NgModule({
  declarations: [ActivePullRequestsComponent, SteelheadActivePullRequestsComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PipesModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    DirectivesModule,
    PipesModule,
    MonitorActionModule,
    MatCardModule,
    MatTableModule,
    StateManagersModule,
    PermissionsModule,
    VerifyButtonModule,
    ErrorSpinnerModule,
  ],
  exports: [SteelheadActivePullRequestsComponent],
})
export class ActivePullRequestsModule {}
