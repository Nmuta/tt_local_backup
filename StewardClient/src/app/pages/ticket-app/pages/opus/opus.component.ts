import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { OpusService } from '@services/opus';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';
import { TicketAppBaseComponent } from '../base/ticket-app.base.component';

/** Routed component for displaying Opus Ticket information. */
@Component({
  templateUrl: './opus.component.html',
  styleUrls: ['./opus.component.scss'],
})
export class OpusComponent extends TicketAppBaseComponent {
  constructor(
    protected readonly opusService: OpusService,
    protected readonly store: Store,
    protected readonly ticketService: TicketService,
  ) {
    super(ticketService, store);
  }

  /** Checks whether the zendesk title matches the title component. */
  public isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean {
    return gameTitle === GameTitleCodeName.FH3;
  }

  /** Requests player identity. */
  public requestPlayerIdentity(gamertag: string): Observable<IdentityResultAlpha> {
    return this.opusService.getPlayerIdentity({ gamertag });
  }
}
