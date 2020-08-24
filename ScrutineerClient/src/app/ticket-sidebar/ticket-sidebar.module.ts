import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';
import { ScrutineerDataParser } from '@shared/helpers';
import { GiftingPageModule } from 'app/side-bar/gifting-page/gifting-page.module';

import { TicketInfoItemModule } from './ticket-info-item/ticket-info-item.module';
import { TicketSidebarComponent } from './ticket-sidebar.cmpt';
import { TicketSidebarRouterModule } from './ticket-sidebar.routing.module';

/** Ticket Sidebar module */
@NgModule({
    imports: [
        CommonModule,
        TicketSidebarRouterModule,
        GiftingPageModule,
        FontAwesomeModule,
        MatButtonModule,
        ProfileModule,
        TicketInfoItemModule
    ],
    providers: [ScrutineerDataParser],
    declarations: [TicketSidebarComponent]
})
export class TicketSidebarModule {}
