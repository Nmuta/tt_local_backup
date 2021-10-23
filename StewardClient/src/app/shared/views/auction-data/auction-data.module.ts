import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionDataComponent } from './auction-data.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';

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
  ],
  exports: [AuctionDataComponent],
})
export class AuctionDataModule {}
