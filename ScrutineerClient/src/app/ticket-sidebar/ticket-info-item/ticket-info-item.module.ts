import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketInfoItemCmpt } from './ticket-info-item.cmpt';
export { TicketInfoItemCmpt } from './ticket-info-item.cmpt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    exports: [TicketInfoItemCmpt],
    declarations: [TicketInfoItemCmpt],
})
export class TicketInfoItemModule {}