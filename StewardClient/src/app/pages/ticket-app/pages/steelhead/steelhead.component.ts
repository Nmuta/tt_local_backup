import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { SteelheadService } from '@services/steelhead';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';
import { TicketAppBaseComponent } from '../base/ticket-app.base.component';

/** Routed component for displaying Steelhead Ticket information. */
@Component({
  templateUrl: './steelhead.component.html',
  styleUrls: ['./steelhead.component.scss'],
})
export class SteelheadComponent extends TicketAppBaseComponent {
  constructor(
    private readonly steelheadService: SteelheadService,
    store: Store,
    ticketService: TicketService,
  ) {
    super(ticketService, store);
  }

  /** Checks whether the zendesk title matches the title component. */
  public isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean {
    return gameTitle === GameTitleCodeName.FM8;
  }

  /** Requests player identity. */
  public requestPlayerIdentity(gamertag: string): Observable<IdentityResultAlpha> {
    return this.steelheadService.getPlayerIdentity({ gamertag });
  }
}
