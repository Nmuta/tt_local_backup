import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseGiftHistoryResultsComponent } from './titles/sunrise/sunrise-gift-history-results.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';

/** A domain module for displaying player gift histories. */
@NgModule({
  declarations: [SunriseGiftHistoryResultsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
  ],
  exports: [SunriseGiftHistoryResultsComponent],
})
export class GiftHistoryResultsModule {}
