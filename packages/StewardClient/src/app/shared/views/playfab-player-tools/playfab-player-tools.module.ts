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
import { PlayFabPlayerToolsComponent } from './playfab-player-tools.component';
import { WoodstockPlayFabPlayerToolsComponent } from './woodstock/woodstock-playfab-player-tools.component';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { MatTableModule } from '@angular/material/table';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PlayFabInventoryComponent } from './components/playfab-inventory/playfab-inventory.component';
import { PlayFabTransactionHistoryComponent } from './components/playfab-transaction-history/playfab-transaction-history.component';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

/** Module for getting and setting a player's cms override. */
@NgModule({
  declarations: [
    PlayFabPlayerToolsComponent,
    WoodstockPlayFabPlayerToolsComponent,
    PlayFabInventoryComponent,
    PlayFabTransactionHistoryComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PipesModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    DirectivesModule,
    MonitorActionModule,
    MatCardModule,
    MatTableModule,
    StateManagersModule,
    PermissionsModule,
    VerifyButtonModule,
    StandardCopyModule,
    MatPaginatorModule,
    StandardDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  exports: [WoodstockPlayFabPlayerToolsComponent],
})
export class PlayFabPlayerToolsModule {}
