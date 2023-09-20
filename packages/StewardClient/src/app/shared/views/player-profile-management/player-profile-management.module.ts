import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { HelpModule } from '@shared/modules/help/help.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PlayerProfileManagementComponent } from './player-profile-management.component';
import { SteelheadPlayerProfileManagementComponent } from './steelhead/steelhead-player-profile-management.component';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** Module for displaying the player profile management component. */
@NgModule({
  declarations: [SteelheadPlayerProfileManagementComponent, PlayerProfileManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatCheckboxModule,
    MatInputModule,
    MatTooltipModule,
    MatListModule,
    MonitorActionModule,
    StateManagersModule,
    MatButtonToggleModule,
    HelpModule,
    VerifyButtonModule,
    PermissionsModule,
  ],
  exports: [SteelheadPlayerProfileManagementComponent],
})
export class PlayerProfileManagementModule {}
