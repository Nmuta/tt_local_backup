import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlayerLookupResultsComponent } from './player-lookup-results.component';

/** A domain module for displaying player lookup results. */
@NgModule({
  declarations: [
    PlayerLookupResultsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ErrorSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
    MatTooltipModule,
  ],
  exports: [
    PlayerLookupResultsComponent
  ],
})
export class PlayerLookupResultsModule {}
