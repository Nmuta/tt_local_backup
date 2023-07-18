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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { PaidEntitlementsComponent } from './paid-entitlements.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
