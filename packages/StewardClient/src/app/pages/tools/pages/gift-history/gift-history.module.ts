import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GiftHistoryComponent } from './gift-history.component';
import { GiftHistoryRouterModule } from './gift-history.routing';
import { GiftHistoryResultsModule } from '@shared/views/gift-history-results/gift-history-results.module';
import { SunriseGiftHistoryComponent } from './sunrise/sunrise-gift-history.component';
import { ApolloGiftHistoryComponent } from './apollo/apollo-gift-history.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { LspGroupSelectionModule } from '@shared/views/lsp-group-selection/lsp-group-selection.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { PlayerInventoryModule } from '@shared/views/player-inventory/player-inventory.module';
import { SteelheadGiftHistoryComponent } from './steelhead/steelhead-gift-history.component';
import { WoodstockGiftHistoryComponent } from './woodstock/woodstock-gift-history.component';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { HelpModule } from '@shared/modules/help/help.module';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { PlayerInventoryProfilesModule } from '@views/player-inventory-profiles/player-inventory-profile-picker.module';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GiftHistoryComponent,
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
    MatTooltipModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    FormsModule,
    PlayerSelectionModule,
    LspGroupSelectionModule,
    MatTabsModule,
    PlayerInventoryModule,
    PlayerInventoryProfilesModule,
    EndpointSelectionModule,
    DateTimePickersModule,
    FormsModule,
    ReactiveFormsModule,
    HelpModule,
  ],
})
export class GiftHistoryModule {}
