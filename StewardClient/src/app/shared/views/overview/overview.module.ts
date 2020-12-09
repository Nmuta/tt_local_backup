import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseOverviewComponent } from './titles/sunrise/sunrise-overview.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

/** A domain module for displaying account overviews. */
@NgModule({
  declarations: [SunriseOverviewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ErrorSpinnerModule,
    PipesModule,
  ],
  exports: [SunriseOverviewComponent],
})
export class OverviewModule {}
