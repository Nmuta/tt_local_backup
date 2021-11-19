import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelDumpComponent } from './model-dump.component';
import { MatCardModule } from '@angular/material/card';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ModelDumpFlagsComponent } from './model-dump-flags/model-dump-flags.component';
import { MatIconModule } from '@angular/material/icon';
import { ModelDumpXuidsComponent } from './model-dump-xuids/model-dump-xuids.component';
import { ModelDumpSimpleTableComponent } from './model-dump-simple/model-dump-simple-table/model-dump-simple-table.component';
import { ModelDumpNumberTableComponent } from './model-dump-simple/model-dump-number-table/model-dump-number-table.component';
import { ModelDumpPriceTableComponent } from './model-dump-simple/model-dump-price-table/model-dump-price-table.component';
import { ModelDumpHumanizeTableComponent } from './model-dump-simple/model-dump-humanize-table/model-dump-humanize-table.component';
import { ModelDumpDurationTableComponent } from './model-dump-simple/model-dump-duration-table/model-dump-duration-table.component';
import { LuxonModule } from 'luxon-angular';
import { NgxHumanizeDurationModule } from 'ngx-humanize-duration';
import { ModelDumpDatetimeTableComponent } from './model-dump-simple/model-dump-datetime-table/model-dump-datetime-table.component';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { StandardFlagModule } from '@components/standard-flag/standard-flag.module';

/** A collection of utilities for rapidly outputting a raw model onto a page. */
@NgModule({
  declarations: [
    ModelDumpComponent,
    ModelDumpFlagsComponent,
    ModelDumpXuidsComponent,
    ModelDumpSimpleTableComponent,
    ModelDumpNumberTableComponent,
    ModelDumpPriceTableComponent,
    ModelDumpHumanizeTableComponent,
    ModelDumpDurationTableComponent,
    ModelDumpDatetimeTableComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    StandardCopyModule,
    StandardDateModule,
    StandardFlagModule,
    PipesModule,
    MatIconModule,
    LuxonModule,
    NgxHumanizeDurationModule,
  ],
  exports: [
    ModelDumpComponent,
    ModelDumpFlagsComponent,
    ModelDumpXuidsComponent,
    ModelDumpSimpleTableComponent,
    ModelDumpNumberTableComponent,
    ModelDumpPriceTableComponent,
    ModelDumpHumanizeTableComponent,
    ModelDumpDurationTableComponent,
    ModelDumpDatetimeTableComponent,
  ],
})
export class ModelDumpModule {}
