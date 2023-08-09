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
import { PlayFabInventoryComponent } from './playfab-inventory.component';
import { WoodstockPlayFabInventoryComponent } from './woodstock/woodstock-playfab-inventory.component';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { MatTableModule } from '@angular/material/table';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { MatPaginatorModule } from '@angular/material/paginator';

/** Module for getting and setting a player's cms override. */
@NgModule({
  declarations: [PlayFabInventoryComponent, WoodstockPlayFabInventoryComponent],
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
    StandardCopyModule,
    MatPaginatorModule,
  ],
  exports: [WoodstockPlayFabInventoryComponent],
})
export class PlayFabInventoryModule {}
