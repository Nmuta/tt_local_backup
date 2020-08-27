import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { TicketInfoItemComponent } from "./ticket-info-item.component";
export { TicketInfoItemComponent } from "./ticket-info-item.component";

/** Defines the ticket information item module. */
@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  exports: [TicketInfoItemComponent],
  declarations: [TicketInfoItemComponent],
})
export class TicketInfoItemModule {}
