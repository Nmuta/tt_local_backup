import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { TicketService } from '@services/zendesk/ticket.service';
import { switchMap, takeUntil } from 'rxjs/operators';

/** Routed component for displaying Apollo Ticket information. */
@Component({
  templateUrl: './apollo.component.html',
  styleUrls: ['./apollo.component.scss'],
})
export class ApolloComponent extends BaseComponent implements OnInit {
  public gamertag: string;
  public xuid: BigInt;
  public gameTitle: GameTitleCodeName;

  constructor(
    private readonly apollo: ApolloService,
    private readonly store: Store,
    private readonly ticket: TicketService,
  ) {
    super();
  }

  /** Init hook. */
  public ngOnInit(): void {
    this.ticket
      .getForzaTitle$()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(title => {
        this.gameTitle = title;
        if (title !== GameTitleCodeName.FM7) {
          this.store.dispatch(new Navigate(['/ticket-app/title/'], null, { replaceUrl: true }));
        }
      });

    this.ticket
      .getTicketRequestorGamertag$()
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(gamertag => this.apollo.getPlayerIdentity({ gamertag })),
      )
      .subscribe(identity => {
        this.gamertag = identity.gamertag;
        this.xuid = identity.xuid;
        // TODO: Handle identity.error
      });
  }
}
