import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseBackstagePassHistoryComponent } from './sunrise/sunrise-backstage-pass-history.component';
import { WoodstockBackstagePassHistoryComponent } from './woodstock/woodstock-backstage-pass-history.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
