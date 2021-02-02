import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GravityGiftHistoryResultsComponent } from './titles/gravity/gravity-gift-history-results.component';
import { SunriseGiftHistoryResultsComponent } from './titles/sunrise/sunrise-gift-history-results.component';
import { ApolloGiftHistoryResultsComponent } from './titles/apollo/apollo-gift-history-results.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

/** A domain module for displaying player gift histories. */
@NgModule({
  declarations: [
    GravityGiftHistoryResultsComponent,
    SunriseGiftHistoryResultsComponent,
    ApolloGiftHistoryResultsComponent,
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
    GravityGiftHistoryResultsComponent,
    SunriseGiftHistoryResultsComponent,
    ApolloGiftHistoryResultsComponent,
  ],
})
export class GiftHistoryResultsModule {}
