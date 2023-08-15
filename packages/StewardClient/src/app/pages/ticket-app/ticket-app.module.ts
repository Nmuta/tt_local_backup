import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerSidebarDetailsModule } from './components/player-sidebar-details/player-sidebar-details.module';

import { TicketAppComponent } from './ticket-app.component';
import { TicketAppRouterModule } from './ticket-app.routing';
import { SunriseComponent } from './pages/sunrise/sunrise.component';
import { ApolloComponent } from './pages/apollo/apollo.component';
import { OpusComponent } from './pages/opus/opus.component';
import { GoToInventoryButtonComponent } from './components/go-to-inventory-button/go-to-inventory-button.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { UnknownTitleComponent } from './pages/unknown-title/unknown-title.component';
import { UserFlagsModule } from '@shared/views/user-flags/user-flags.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OverlayComponent } from './components/overlay/overlay.component';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { SteelheadComponent } from './pages/steelhead/steelhead.component';
import { WoodstockComponent } from './pages/woodstock/woodstock.component';
import { MatIconModule } from '@angular/material/icon';
import { GiftHistoryResultsModule } from '@views/gift-history-results/gift-history-results.module';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

/** Defines the ticket sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    TicketAppRouterModule,
    FontAwesomeModule,
    PlayerSidebarDetailsModule,
    UserFlagsModule,
    BanHistoryModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatIconModule,
    JsonDumpModule,
    GiftHistoryResultsModule,
    TourMatMenuModule,    // loaded to ensure tours run properly
  ],
  providers: [],
  declarations: [
    TicketAppComponent,
    SunriseComponent,
    SteelheadComponent,
    WoodstockComponent,
    ApolloComponent,
    OpusComponent,
    TicketAppComponent,
    GoToInventoryButtonComponent,
    QuickActionsComponent,
    OverlayComponent,
    UnknownTitleComponent,
  ],
})
export class TicketAppModule {}
