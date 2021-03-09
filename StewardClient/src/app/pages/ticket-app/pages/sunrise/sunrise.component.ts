import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { SunriseService } from '@services/sunrise';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';
import { TicketAppBaseComponent } from '../base/ticket-app.base.component';

/** Routed component for displaying Sunrise Ticket information. */
@Component({
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunriseComponent extends TicketAppBaseComponent {
  constructor(
    protected readonly sunriseService: SunriseService,
    protected readonly store: Store,
    protected readonly ticketService: TicketService,
  ) {
    super(ticketService, store);
  }

  /** Checks whether the zendesk title matches the title component. */
  public isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean {
    return gameTitle === GameTitleCodeName.FH4;
  }

  /** Requests player identity. */
  public requestPlayerIdentity(gamertag: string): Observable<IdentityResultAlpha> {
    return this.sunriseService.getPlayerIdentity({ gamertag });
  }
}
