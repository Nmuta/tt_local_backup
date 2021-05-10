import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseOverviewComponent } from './titles/sunrise/sunrise-overview.component';
import { WoodstockOverviewComponent } from './titles/woodstock/woodstock-overview.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
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
