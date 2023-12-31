import { NgModule } from '@angular/core';
import { SunriseGiftHistoryResultsComponent } from './sunrise/sunrise-gift-history-results.component';
import { ApolloGiftHistoryResultsComponent } from './apollo/apollo-gift-history-results.component';
import { SteelheadGiftHistoryResultsComponent } from './steelhead/steelhead-gift-history-results.component';
import { WoodstockGiftHistoryResultsComponent } from './woodstock/woodstock-gift-history-results.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { PlayerInventoryModule } from '@views/player-inventory/player-inventory.module';
import { InventoryItemListDisplayModule } from '@views/inventory-item-list-display/inventory-item-list-display.module';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RouterModule } from '@angular/router';
import { GiftHistoryResultsComponent } from './gift-history-results.component';
import { GiftHistoryResultsCompactComponent } from './gift-history-results-compact/gift-history-results-compact.component';
import { ApolloGiftHistoryResultsCompactComponent } from './gift-history-results-compact/apollo/apollo-gift-history-results-compact.component';
import { SteelheadGiftHistoryResultsCompactComponent } from './gift-history-results-compact/steelhead/steelhead-gift-history-results-compact.component';
import { SunriseGiftHistoryResultsCompactComponent } from './gift-history-results-compact/sunrise/sunrise-gift-history-results-compact.component';
import { WoodstockGiftHistoryResultsCompactComponent } from './gift-history-results-compact/woodstock/woodstock-gift-history-results-compact.component';
import { StandardDateModule } from '@components/standard-date/standard-date.module';

/** A domain module for displaying player gift histories. */
@NgModule({
  declarations: [
    GiftHistoryResultsComponent,
    WoodstockGiftHistoryResultsComponent,
    SteelheadGiftHistoryResultsComponent,
    SunriseGiftHistoryResultsComponent,
    ApolloGiftHistoryResultsComponent,

    GiftHistoryResultsCompactComponent,
    WoodstockGiftHistoryResultsCompactComponent,
    SteelheadGiftHistoryResultsCompactComponent,
    SunriseGiftHistoryResultsCompactComponent,
    ApolloGiftHistoryResultsCompactComponent,
  ],
  imports: [
    CommonModule,
    ...STANDARD_DATE_IMPORTS,
    MatCardModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ErrorSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
    MatTooltipModule,
    StewardUserModule,
    PlayerInventoryModule,
    InventoryItemListDisplayModule,
    MatIconModule,
    MonitorActionModule,
    MatButtonModule,
    RouterModule,
    StandardDateModule,
  ],
  exports: [
    WoodstockGiftHistoryResultsComponent,
    SteelheadGiftHistoryResultsComponent,
    SunriseGiftHistoryResultsComponent,
    ApolloGiftHistoryResultsComponent,

    WoodstockGiftHistoryResultsCompactComponent,
    SteelheadGiftHistoryResultsCompactComponent,
    SunriseGiftHistoryResultsCompactComponent,
    ApolloGiftHistoryResultsCompactComponent,
  ],
})
export class GiftHistoryResultsModule {}
