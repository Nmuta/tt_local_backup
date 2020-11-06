import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ContentCollapseModule } from '@components/content-collapse/content-collapse.module';
import { PlayerDetailsModule } from '@components/player-details/player-details.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';
import { GiftingPageModule } from 'app/navbar-app/gifting-page/gifting-page.module';

import { TicketAppComponent } from './ticket-app.component';
import { TicketAppRouterModule } from './ticket-app.routing.module';
import { TicketInfoItemModule } from './ticket-info-item/ticket-info-item.module';

/** Defines the ticket sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    TicketAppRouterModule,
    GiftingPageModule,
    FontAwesomeModule,
    ProfileModule,
    TicketInfoItemModule,
    PlayerDetailsModule,
    MatButtonModule,
    MatCardModule,
    ContentCollapseModule
  ],
  providers: [],
  declarations: [TicketAppComponent],
})
export class TicketAppModule {}
