import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { SunriseService } from '@services/sunrise';
import { TicketService } from '@services/zendesk/ticket.service';
import { takeUntil, switchMap } from 'rxjs/operators';

/** Routed component for displaying Sunrise Ticket information. */
@Component({
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunriseComponent extends BaseComponent implements OnInit {
  public gamertag: string;
  public xuid: bigint;
  public gameTitle: GameTitleCodeName;

  constructor(
    private readonly sunrise: SunriseService,
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
        if (title !== GameTitleCodeName.FH4) {
          this.store.dispatch(new Navigate(['/ticket-app/title/'], null, { replaceUrl: true }));
        }
      });

    this.ticket
      .getTicketRequestorGamertag$()
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(gamertag => this.sunrise.getPlayerIdentity({ gamertag })),
      )
      .subscribe(identity => {
        this.gamertag = identity.gamertag;
        this.xuid = identity.xuid;
        // TODO: Handle identity.error
      });
  }
}
