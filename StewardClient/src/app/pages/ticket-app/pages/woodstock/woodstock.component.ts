import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { WoodstockService } from '@services/woodstock';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';
import { TicketAppBaseComponent } from '../base/ticket-app.base.component';

/** Routed component for displaying Woodstock Ticket information. */
@Component({
  templateUrl: './woodstock.component.html',
  styleUrls: ['./woodstock.component.scss'],
})
export class WoodstockComponent extends TicketAppBaseComponent<IdentityResultAlpha> {
  constructor(
    private readonly woodstockService: WoodstockService,
    store: Store,
    ticketService: TicketService,
  ) {
    super(ticketService, store);
  }

  /** Checks whether the zendesk title matches the title component. */
  public isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean {
    return gameTitle === GameTitleCodeName.FH5;
  }

  /** Requests player identity. */
  public requestPlayerIdentity$(gamertag: string): Observable<IdentityResultAlpha> {
    return this.woodstockService.getPlayerIdentity$({ gamertag });
  }
}
