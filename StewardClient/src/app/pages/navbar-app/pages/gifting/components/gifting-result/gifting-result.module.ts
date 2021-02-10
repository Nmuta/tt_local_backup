import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { GiftingResultComponent } from './gifting-result.component';
import { MatExpansionModule } from '@angular/material/expansion';

/** The  module for the gifting result component. */
@NgModule({
  declarations: [GiftingResultComponent],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
  ],
  exports: [GiftingResultComponent],
})
export class GiftingResultModule {}
