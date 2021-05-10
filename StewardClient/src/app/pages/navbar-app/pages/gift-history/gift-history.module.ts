import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GiftHistoryComponent } from './gift-history.component';
import { GiftHistoryRouterModule } from './gift-history.routing';
import { GravityGiftHistoryComponent } from './gravity/gravity-gift-history.component';
import { GiftHistoryResultsModule } from '@shared/views/gift-history-results/gift-history-results.module';
import { SunriseGiftHistoryComponent } from './sunrise/sunrise-gift-history.component';
import { ApolloGiftHistoryComponent } from './apollo/apollo-gift-history.component';
import { MatCardModule } from '@angular/material/card';
import { LspGroupSelectionModule } from '@navbar-app/components/lsp-group-selection/lsp-group-selection.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PlayerSelectionModule } from '@navbar-app/components/player-selection/player-selection.module';
import { PlayerInventoryModule } from '@shared/views/player-inventory/player-inventory.module';
import { PlayerInventoryProfilesModule } from '@shared/views/player-inventory-profiles/player-inventory-profiles.module';
import { SteelheadGiftHistoryComponent } from './steelhead/steelhead-gift-history.component';
import { WoodstockGiftHistoryComponent } from './woodstock/woodstock-gift-history.component';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GiftHistoryComponent,
    GravityGiftHistoryComponent,
    SunriseGiftHistoryComponent,
    ApolloGiftHistoryComponent,
    SteelheadGiftHistoryComponent,
    WoodstockGiftHistoryComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    GiftHistoryRouterModule,
    GiftHistoryResultsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    PlayerSelectionModule,
    LspGroupSelectionModule,
    MatTabsModule,
    PlayerInventoryModule,
    PlayerInventoryProfilesModule,
  ],
})
export class GiftHistoryModule {}
