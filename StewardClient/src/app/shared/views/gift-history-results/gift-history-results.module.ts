import { NgModule } from '@angular/core';
import { GravityGiftHistoryResultsComponent } from './gravity/gravity-gift-history-results.component';
import { SunriseGiftHistoryResultsComponent } from './sunrise/sunrise-gift-history-results.component';
import { ApolloGiftHistoryResultsComponent } from './apollo/apollo-gift-history-results.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { PlayerInventoryModule } from '@views/player-inventory/player-inventory.module';
import { InventoryItemListDisplayModule } from '@views/inventory-item-list-display/inventory-item-list-display.module';
import { SteelheadGiftHistoryResultsComponent } from './steelhead/steelhead-gift-history-results.component';
import { WoodstockGiftHistoryResultsComponent } from './woodstock/woodstock-gift-history-results.component';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/** A domain module for displaying player gift histories. */
@NgModule({
  declarations: [
    WoodstockGiftHistoryResultsComponent,
    SteelheadGiftHistoryResultsComponent,
    GravityGiftHistoryResultsComponent,
    SunriseGiftHistoryResultsComponent,
    ApolloGiftHistoryResultsComponent,
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
  ],
  exports: [
    WoodstockGiftHistoryResultsComponent,
    SteelheadGiftHistoryResultsComponent,
    GravityGiftHistoryResultsComponent,
    SunriseGiftHistoryResultsComponent,
    ApolloGiftHistoryResultsComponent,
  ],
})
export class GiftHistoryResultsModule {}
