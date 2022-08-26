import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionDataComponent } from './auction-data.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { ModelDumpModule } from '@shared/modules/model-dump/model-dump.module';

/**
 *  A feature module that displays found auction data.
 */
@NgModule({
  declarations: [AuctionDataComponent],
  imports: [
    CommonModule,
    PipesModule,
    StandardCopyModule,
    MatTooltipModule,
    StandardDateModule,
    ErrorSpinnerModule,
    ModelDumpModule,
  ],
  exports: [AuctionDataComponent],
})
export class AuctionDataModule {}
