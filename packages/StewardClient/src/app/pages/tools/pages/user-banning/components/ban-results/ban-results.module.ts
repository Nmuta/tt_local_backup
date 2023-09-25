import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { DirectivesModule } from '@shared/directives/directives.module';
import { BanResultsComponent } from './ban-results.component';

/** The  module for the gifting result component. */
@NgModule({
  declarations: [BanResultsComponent],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
  ],
  exports: [BanResultsComponent],
})
export class BanResultsModule {}
