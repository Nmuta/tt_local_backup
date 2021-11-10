import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GiftingComponent } from './gifting.component';
import { GiftingRouterModule } from './gifting.routing';
import { GravityGiftingComponent } from './gravity/gravity-gifting.component';
import { SunriseGiftingComponent } from './sunrise/sunrise-gifting.component';
import { ApolloGiftingComponent } from './apollo/apollo-gifting.component';
import { MatCardModule } from '@angular/material/card';
import { LspGroupSelectionModule } from '@shared/views/lsp-group-selection/lsp-group-selection.module';
import { MatTabsModule } from '@angular/material/tabs';
import { GiftBasketModule } from './components/gift-basket/gift-basket.module';
import { ItemSelectionModule } from './components/item-selection/item-selection.module';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { PlayerInventoryProfilesModule } from '@shared/views/player-inventory-profiles/player-inventory-profiles.module';
import { PlayerInventoryModule } from '@shared/views/player-inventory/player-inventory.module';
import { SteelheadGiftingComponent } from './steelhead/steelhead-gifting.component';
import { WoodstockGiftingComponent } from './woodstock/woodstock-gifting.component';
import { PlayerAccountInventoryModule } from '@views/player-account-inventory/player-account-inventory.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GiftingComponent,
    GravityGiftingComponent,
    SunriseGiftingComponent,
    ApolloGiftingComponent,
    SteelheadGiftingComponent,
    WoodstockGiftingComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    GiftingRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    LspGroupSelectionModule,
    MatTabsModule,
    GiftBasketModule,
    ItemSelectionModule,
    PlayerSelectionModule,
    PlayerInventoryProfilesModule,
    PlayerInventoryModule,
    PlayerAccountInventoryModule,
    EndpointSelectionModule,
  ],
})
export class GiftingsModule {}
