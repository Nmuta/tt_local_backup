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
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { PlayFabPlayerToolsComponent } from './playfab-player-tools.component';
import { WoodstockPlayFabPlayerToolsComponent } from './woodstock/woodstock-playfab-player-tools.component';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { PlayFabInventoryComponent } from './components/playfab-inventory/playfab-inventory.component';
import { PlayFabTransactionHistoryComponent } from './components/playfab-transaction-history/playfab-transaction-history.component';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

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
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  exports: [WoodstockPlayFabPlayerToolsComponent],
})
export class PlayFabPlayerToolsModule {}
