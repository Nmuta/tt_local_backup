import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseBackstagePassHistoryComponent } from './sunrise/sunrise-backstage-pass-history.component';
import { WoodstockBackstagePassHistoryComponent } from './woodstock/woodstock-backstage-pass-history.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatButtonModule } from '@angular/material/button';
import { LuxonModule } from 'luxon-angular';

/** A domain module for displaying backstage pass history. */
@NgModule({
  declarations: [WoodstockBackstagePassHistoryComponent, SunriseBackstagePassHistoryComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatButtonModule,
    LuxonModule,
  ],
  exports: [WoodstockBackstagePassHistoryComponent, SunriseBackstagePassHistoryComponent],
})
export class BackstagePassHistoryModule {}
