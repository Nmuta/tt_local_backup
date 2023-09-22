import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerAccountInventoryComponent } from './sunrise/sunrise-player-account-inventory.component';
import { WoodstockPlayerAccountInventoryComponent } from './woodstock/woodstock-player-account-inventory.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';

/** A domain module for displaying player account inventory. */
@NgModule({
  declarations: [SunrisePlayerAccountInventoryComponent, WoodstockPlayerAccountInventoryComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    JsonDumpModule,
    MatCardModule,
    ErrorSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    MatTooltipModule,
    MatIconModule,
  ],
  exports: [SunrisePlayerAccountInventoryComponent, WoodstockPlayerAccountInventoryComponent],
})
export class PlayerAccountInventoryModule {}
