import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { T10IdInfo } from '@models/identity-query.model';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { GravityService } from '@services/gravity';
import { TicketService } from '@services/zendesk/ticket.service';
import { switchMap, takeUntil } from 'rxjs/operators';

/** Routed component for displaying Gravity Ticket information. */
@Component({
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss'],
})
export class GravityComponent extends BaseComponent implements OnInit {
  public gamertag: string;
  public xuid: bigint;
  public t10Id: string;
  public t10Ids: T10IdInfo[];
  public gameTitle: GameTitleCodeName;

  constructor(
    private readonly gravity: GravityService,
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
        if (title !== GameTitleCodeName.Street) {
          this.store.dispatch(new Navigate(['/ticket-app/title/'], null, { replaceUrl: true }));
        }
      });

    this.ticket
      .getTicketRequestorGamertag$()
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(gamertag => this.gravity.getPlayerIdentity({ gamertag })),
      )
      .subscribe(identity => {
        this.gamertag = identity.gamertag;
        this.xuid = identity.xuid;
        this.t10Id = identity.t10Id;
        this.t10Ids = identity.t10Ids;
        // TODO: Handle identity.error
      });
  }
}
