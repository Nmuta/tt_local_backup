import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';
import { GiftingPageModule } from 'app/navbar-app/gifting-page/gifting-page.module';

import { TicketInfoItemModule } from './ticket-info-item/ticket-info-item.module';
import { TicketSidebarComponent } from './ticket-sidebar.component';
import { TicketSidebarRouterModule } from './ticket-sidebar.routing.module';

/** Defines the ticket sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    TicketSidebarRouterModule,
    GiftingPageModule,
    FontAwesomeModule,
    ProfileModule,
    TicketInfoItemModule,
  ],
  providers: [],
  declarations: [TicketSidebarComponent],
})
export class TicketSidebarModule {}
