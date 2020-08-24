import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketInfoItemComponent } from './ticket-info-item.cmpt';
export { TicketInfoItemComponent } from './ticket-info-item.cmpt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    exports: [TicketInfoItemComponent],
    declarations: [TicketInfoItemComponent],
})
export class TicketInfoItemModule {}
