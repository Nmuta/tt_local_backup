import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrutineerDataParser } from "@shared/helpers";
import { TicketSidebarRouterModule } from "./ticket-sidebar.routing.module";
import { TicketSidebarCmpt } from "./ticket-sidebar.cmpt";
import { TicketInfoItemModule } from "./ticket-info-item/ticket-info-item.module";

import { GiftingPageModule } from "app/side-bar/gifting-page/gifting-page.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

import { ProfileModule } from '@shared/components/profile/profile.module';

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
    declarations: [TicketSidebarCmpt]
})
export class TicketSidebarModule {}