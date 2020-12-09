import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { OpusService } from '@services/opus';
import { TicketService } from '@services/zendesk/ticket.service';
import { takeUntil, switchMap } from 'rxjs/operators';

/** Routed component for displaying Opus Ticket information. */
@Component({
  templateUrl: './opus.component.html',
  styleUrls: ['./opus.component.scss'],
})
export class OpusComponent extends BaseComponent implements OnInit {
  public gamertag: string;
  public xuid: BigInt;
  public gameTitle: GameTitleCodeName;

  constructor(
    private readonly opus: OpusService,
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
        if (title !== GameTitleCodeName.FH3) {
          this.store.dispatch(
            new Navigate(['/ticket-app/title/'], null, { skipLocationChange: true }),
          );
        }
      });

    this.ticket
      .getTicketRequestorGamertag$()
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(gamertag => this.opus.getIdentity({ gamertag })),
      )
      .subscribe(identity => {
        this.gamertag = identity.gamertag;
        this.xuid = identity.xuid;
        // TODO: Handle identity.error
      });
  }
}
