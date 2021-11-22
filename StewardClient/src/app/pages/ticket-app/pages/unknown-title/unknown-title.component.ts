import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';

/** A routing component for the ticket sidebar app, navigated to when the title is unknown. */
@Component({
  templateUrl: './unknown-title.component.html',
  styleUrls: ['./unknown-title.component.scss'],
})
export class UnknownTitleComponent extends BaseComponent implements OnInit {
  constructor(private readonly store: Store, private readonly ticket: TicketService) {
    super();
  }

  /** Init hook. */
  public ngOnInit(): void {
    this.handleRouting();
  }

  private handleRouting(): void {
    this.ticket.getForzaTitle$().subscribe(title => {
      this.routeByTitle$(title);
    });
  }

  /** Routes to the appropriate title page. */
  private routeByTitle$(title: GameTitleCodeName): Observable<void> {
    switch (title) {
      case GameTitleCodeName.FH5:
        return this.store.dispatch(
          new Navigate(['/ticket-app/title/woodstock'], null, { replaceUrl: true }),
        );
      case GameTitleCodeName.FM8:
        return this.store.dispatch(
          new Navigate(['/ticket-app/title/steelhead'], null, { replaceUrl: true }),
        );
      case GameTitleCodeName.Street:
        return this.store.dispatch(
          new Navigate(['/ticket-app/title/gravity'], null, { replaceUrl: true }),
        );
      case GameTitleCodeName.FH4:
        return this.store.dispatch(
          new Navigate(['/ticket-app/title/sunrise'], null, { replaceUrl: true }),
        );
      case GameTitleCodeName.FM7:
        return this.store.dispatch(
          new Navigate(['/ticket-app/title/apollo'], null, { replaceUrl: true }),
        );
      case GameTitleCodeName.FH3:
        return this.store.dispatch(
          new Navigate(['/ticket-app/title/opus'], null, { replaceUrl: true }),
        );
    }
  }
}
