import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { LuxonModule } from 'luxon-angular';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { HelpModule } from '@shared/modules/help/help.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { WoodstockLoyaltyRewardsComponent } from './woodstock/woodstock-loyalty-rewards.component';
import { SteelheadLoyaltyRewardsComponent } from './steelhead/steelhead-loyalty-rewards.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PlayerInventoryProfilesCompositionModule } from '@views/player-inventory-profiles-composition/player-inventory-profile-picker.module';

/** Module for player entitlements data. */
@NgModule({
  declarations: [WoodstockLoyaltyRewardsComponent, SteelheadLoyaltyRewardsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    PipesModule,
    JsonDumpModule,
    LuxonModule,
    DirectivesModule,
    MatCardModule,
    MatTableModule,
    ErrorSpinnerModule,
    PlayerInventoryProfilesCompositionModule,
    MatButtonModule,
    MatCheckboxModule,
    VerifyCheckboxModule,
    StateManagersModule,
    MonitorActionModule,
    HelpModule,
    DirectivesModule,
    PermissionsModule,
    MatFormFieldModule,
  ],
  exports: [WoodstockLoyaltyRewardsComponent, SteelheadLoyaltyRewardsComponent],
})
export class LoyaltyRewardsModule {}
