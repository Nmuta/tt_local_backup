import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleListComponent } from './toggle-list/toggle-list.component';
import { StandardFlagModule } from '@components/standard-flag/standard-flag.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ToggleListEzComponent } from './toggle-list-ez/toggle-list-ez.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MonitorActionModule } from '../monitor-action/monitor-action.module';
import { StateManagersModule } from '../state-managers/state-managers.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { VerifyButtonModule } from '../verify/verify-button.module';
import { PermissionsModule } from '../permissions/permissions.module';

/**
 * Module for standardized form components.
 */
@NgModule({
  declarations: [ToggleListComponent, ToggleListEzComponent],
  imports: [
    CommonModule,
    StandardFlagModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCardModule,
    PipesModule,
    MatIconModule,
    MatButtonModule,
    MonitorActionModule,
    StateManagersModule,
    MatTooltipModule,
    VerifyButtonModule,
    PermissionsModule,
  ],
  exports: [ToggleListComponent, ToggleListEzComponent],
})
export class StandardFormModule {}
