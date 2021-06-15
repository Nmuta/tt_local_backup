import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerAccountInventoryComponent } from './sunrise/sunrise-player-account-inventory.component';
import { WoodstockPlayerAccountInventoryComponent } from './woodstock/woodstock-player-account-inventory.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
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
