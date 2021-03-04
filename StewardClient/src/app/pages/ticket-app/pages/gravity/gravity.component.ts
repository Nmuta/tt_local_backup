import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { GravityService } from '@services/gravity';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';
import { TicketAppBaseComponent } from '../base/ticket-app.base.component';

/** Routed component for displaying Gravity Ticket information. */
@Component({
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss'],
})
export class GravityComponent extends TicketAppBaseComponent {
  constructor(
    protected readonly gravityService: GravityService,
    protected readonly store: Store,
    protected readonly ticketService: TicketService,
  ) {
    super(ticketService, store);
  }

  /** Checks whether the zendesk title matches the title component. */
  public isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean {
    return gameTitle === GameTitleCodeName.Street;
  }

  /** Requests player identity. */
  public requestPlayerIdentity(gamertag: string): Observable<IdentityResultBeta> {
    return this.gravityService.getPlayerIdentity({ gamertag });
  }
}
