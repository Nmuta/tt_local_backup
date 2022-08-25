import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GiftingComponent } from './gifting.component';
import { GiftingRouterModule } from './gifting.routing';
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
import { GiftLiveryModule } from './components/gift-livery/gift-livery.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WoodstockGiftSpecialLiveriesComponent } from './components/gift-special-liveries/woodstock/woodstock-gift-special-liveries.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { LuxonModule } from 'luxon-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { HelpModule } from '@shared/modules/help/help.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GiftingComponent,
    SunriseGiftingComponent,
    ApolloGiftingComponent,
    SteelheadGiftingComponent,
    WoodstockGiftingComponent,
    WoodstockGiftSpecialLiveriesComponent,
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
    MatTooltipModule,
    FontAwesomeModule,
    FormsModule,
    LspGroupSelectionModule,
    MatTabsModule,
    GiftBasketModule,
    GiftLiveryModule,
    ItemSelectionModule,
    PlayerSelectionModule,
    PlayerInventoryProfilesModule,
    PlayerInventoryModule,
    PlayerAccountInventoryModule,
    EndpointSelectionModule,
    PipesModule,
    LuxonModule,
    MatExpansionModule,
    MatCheckboxModule,
    DirectivesModule,
    MonitorActionModule,
    StateManagersModule,
    HelpModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class GiftingsModule {}
