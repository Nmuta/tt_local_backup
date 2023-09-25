import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseOverviewComponent } from './sunrise/sunrise-overview.component';
import { WoodstockOverviewComponent } from './woodstock/woodstock-overview.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';

/** A domain module for displaying account overviews. */
@NgModule({
  declarations: [WoodstockOverviewComponent, SunriseOverviewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ErrorSpinnerModule,
    PipesModule,
    JsonDumpModule,
  ],
  exports: [WoodstockOverviewComponent, SunriseOverviewComponent],
})
export class OverviewModule {}
