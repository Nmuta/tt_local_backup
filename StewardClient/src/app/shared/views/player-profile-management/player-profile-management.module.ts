import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { HelpModule } from '@shared/modules/help/help.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PlayerProfileManagementComponent } from './player-profile-management.component';
import { SteelheadPlayerProfileManagementComponent } from './steelhead/steelhead-player-profile-management.component';

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
  ],
  exports: [SteelheadPlayerProfileManagementComponent],
})
export class PlayerProfileManagementModule {}
