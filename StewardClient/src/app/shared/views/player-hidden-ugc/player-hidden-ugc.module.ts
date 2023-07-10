import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenUgcTableComponent } from './hidden-ugc-table/hidden-ugc-table.component';
import { SunrisePlayerHiddenUgcComponent } from './sunrise-player-hidden-ugc/sunrise-player-hidden-ugc.component';
import { MatTableModule } from '@angular/material/table';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { SteelheadPlayerHiddenUgcComponent } from './steelhead-player-hidden-ugc/steelhead-player-hidden-ugc.component';

/**
 *  A feature module for retrieving and displaying a player's hidden UGC.
 */
@NgModule({
  declarations: [HiddenUgcTableComponent, SunrisePlayerHiddenUgcComponent],
  imports: [
    CommonModule,
    MatTableModule,
    StandardDateModule,
    StandardCopyModule,
    MonitorActionModule,
    MatButtonModule,
    MatCheckboxModule,
    StateManagersModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    VerifyButtonModule,
    PermissionsModule,
  ],
  exports: [HiddenUgcTableComponent, SunrisePlayerHiddenUgcComponent],
})
export class PlayerHiddenUgcModule {}
