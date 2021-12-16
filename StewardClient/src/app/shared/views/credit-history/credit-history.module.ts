import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseCreditHistoryComponent } from './sunrise/sunrise-credit-history.component';
import { WoodstockCreditHistoryComponent } from './woodstock/woodstock-credit-history.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatButtonModule } from '@angular/material/button';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HelpModule } from '@shared/modules/help/help.module';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { StandardDateModule } from '@components/standard-date/standard-date.module';

/** A domain module for displaying credit histories. */
@NgModule({
  declarations: [WoodstockCreditHistoryComponent, SunriseCreditHistoryComponent],
  imports: [
    ...STANDARD_DATE_IMPORTS,
    StandardDateModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatButtonModule,
    TableVirtualScrollModule,
    ScrollingModule,
    HelpModule,
  ],
  exports: [WoodstockCreditHistoryComponent, SunriseCreditHistoryComponent],
})
export class CreditHistoryModule {}
