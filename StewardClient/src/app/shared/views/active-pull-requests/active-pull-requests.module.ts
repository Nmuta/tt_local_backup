import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatCardModule } from '@angular/material/card';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { ActivePullRequestsComponent } from './active-pull-requests.component';
import { SteelheadActivePullRequestsComponent } from './steelhead/steelhead-active-pull-requests.component';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';

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
    VerifyCheckboxModule,
    ErrorSpinnerModule,
  ],
  exports: [SteelheadActivePullRequestsComponent],
})
export class ActivePullRequestsModule {}
