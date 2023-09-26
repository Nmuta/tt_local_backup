import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GiftingComponent } from './gifting.component';
import { GiftingRouterModule } from './gifting.routing';
import { SunriseGiftingComponent } from './sunrise/sunrise-gifting.component';
import { ApolloGiftingComponent } from './apollo/apollo-gifting.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { LspGroupSelectionModule } from '@shared/views/lsp-group-selection/lsp-group-selection.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { GiftBasketModule } from './components/gift-basket/gift-basket.module';
import { ItemSelectionModule } from './components/item-selection/item-selection.module';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { PlayerInventoryModule } from '@shared/views/player-inventory/player-inventory.module';
import { SteelheadGiftingComponent } from './steelhead/steelhead-gifting.component';
import { WoodstockGiftingComponent } from './woodstock/woodstock-gifting.component';
import { PlayerAccountInventoryModule } from '@views/player-account-inventory/player-account-inventory.module';
import { GiftLiveryModule } from './components/gift-livery/gift-livery.module';
import { BulkGiftLiveryModule } from './components/bulk-gift-livery/bulk-gift-livery.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { GiftSpecialLiveriesComponent } from './components/gift-special-liveries/gift-special-liveries.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { LuxonModule } from 'luxon-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { HelpModule } from '@shared/modules/help/help.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { PlayerInventoryProfilesModule } from '@views/player-inventory-profiles/player-inventory-profile-picker.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GiftingComponent,
    SunriseGiftingComponent,
    ApolloGiftingComponent,
    SteelheadGiftingComponent,
    WoodstockGiftingComponent,
    GiftSpecialLiveriesComponent,
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
    BulkGiftLiveryModule,
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
    PermissionsModule,
    VerifyButtonModule,
  ],
})
export class GiftingsModule {}
