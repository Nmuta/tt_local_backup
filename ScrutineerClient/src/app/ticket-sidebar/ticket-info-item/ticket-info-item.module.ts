import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TicketInfoItemComponent } from './ticket-info-item.cmpt';
export { TicketInfoItemComponent } from './ticket-info-item.cmpt';

/** Ticket Information Item module */
@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    exports: [TicketInfoItemComponent],
    declarations: [TicketInfoItemComponent],
})
export class TicketInfoItemModule {}
