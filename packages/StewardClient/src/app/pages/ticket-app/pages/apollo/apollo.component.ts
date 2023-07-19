import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';
import { TicketAppBaseComponent } from '../base/ticket-app.base.component';

/** Routed component for displaying Apollo Ticket information. */
@Component({
  templateUrl: './apollo.component.html',
  styleUrls: ['./apollo.component.scss'],
})
export class ApolloComponent extends TicketAppBaseComponent<IdentityResultAlpha> {
  constructor(
    private readonly apolloService: ApolloService,
    store: Store,
    ticketService: TicketService,
  ) {
    super(ticketService, store);
  }

  /** Checks whether the zendesk title matches the title component. */
  public isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean {
    return gameTitle === GameTitleCodeName.FM7;
  }

  /** Requests player identity. */
  public requestPlayerIdentity$(gamertag: string): Observable<IdentityResultAlpha> {
    return this.apolloService.getPlayerIdentity$({ gamertag });
  }
}
