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
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { PaidEntitlementsComponent } from './paid-entitlements.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { SteelheadPaidEntitlementsComponent } from './steelhead/steelhead-paid-entitlements.component';

/** Module for getting and setting a player's report weight. */
@NgModule({
  declarations: [PaidEntitlementsComponent, SteelheadPaidEntitlementsComponent],
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
    FormsModule,
    ReactiveFormsModule,
    MonitorActionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    StateManagersModule,
    PermissionsModule,
    MatCheckboxModule,
    VerifyButtonModule,
  ],
  exports: [PaidEntitlementsComponent, SteelheadPaidEntitlementsComponent],
})
export class PaidEntitlementsModule {}
