import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenUgcTableComponent } from './hidden-ugc-table/hidden-ugc-table.component';
import { SunrisePlayerHiddenUgcComponent } from './sunrise-player-hidden-ugc/sunrise-player-hidden-ugc.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

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
