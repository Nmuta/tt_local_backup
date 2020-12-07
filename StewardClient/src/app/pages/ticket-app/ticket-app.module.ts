import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ContentCollapseModule } from '@components/content-collapse/content-collapse.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerDetailsModule } from '@shared/views/player-details/player-details.module';

import { TicketAppComponent } from './ticket-app.component';
import { TicketAppRouterModule } from './ticket-app.routing';
import { SunriseComponent } from './pages/sunrise/sunrise.component';
import { GravityComponent } from './pages/gravity/gravity.component';
import { ApolloComponent } from './pages/apollo/apollo.component';
import { OpusComponent } from './pages/opus/opus.component';
import { GoToInventoryButtonComponent } from './components/go-to-inventory-button/go-to-inventory-button.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { UnknownComponent } from './pages/unknown/unknown.component';
import { UserFlagsModule } from '@shared/views/user-flags/user-flags.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';

/** Defines the ticket sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    TicketAppRouterModule,
    FontAwesomeModule,
    PlayerDetailsModule,
    UserFlagsModule,
    BanHistoryModule,
    MatButtonModule,
    MatCardModule,
    ContentCollapseModule,
  ],
  providers: [],
  declarations: [
    TicketAppComponent,
    SunriseComponent,
    GravityComponent,
    ApolloComponent,
    OpusComponent,
    UnknownComponent,
    GoToInventoryButtonComponent,
    QuickActionsComponent,
  ],
})
export class TicketAppModule {}
