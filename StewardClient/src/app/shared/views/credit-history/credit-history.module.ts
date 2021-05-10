import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseCreditHistoryComponent } from './titles/sunrise/sunrise-credit-history.component';
import { WoodstockCreditHistoryComponent } from './titles/woodstock/woodstock-credit-history.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatButtonModule } from '@angular/material/button';

/** A domain module for displaying credit histories. */
@NgModule({
  declarations: [WoodstockCreditHistoryComponent, SunriseCreditHistoryComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatButtonModule,
  ],
  exports: [WoodstockCreditHistoryComponent, SunriseCreditHistoryComponent],
})
export class CreditHistoryModule {}
