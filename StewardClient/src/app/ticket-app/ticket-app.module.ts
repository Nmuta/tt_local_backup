import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';
import { GiftingPageModule } from 'app/navbar-app/gifting-page/gifting-page.module';

import { TicketInfoItemModule } from './ticket-info-item/ticket-info-item.module';
import { TicketAppComponent } from './ticket-app.component';
import { TicketAppRouterModule } from './ticket-app.routing.module';

/** Defines the ticket sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    TicketAppRouterModule,
    GiftingPageModule,
    FontAwesomeModule,
    ProfileModule,
    TicketInfoItemModule,
  ],
  providers: [],
  declarations: [TicketAppComponent],
})
export class TicketAppModule {}
