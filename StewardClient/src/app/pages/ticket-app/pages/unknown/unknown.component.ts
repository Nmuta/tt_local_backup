import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TicketService } from '@services/zendesk/ticket.service';
import { Observable } from 'rxjs';

/** A routing component. */
@Component({
  selector: 'app-unknown',
  templateUrl: './unknown.component.html',
  styleUrls: ['./unknown.component.scss'],
})
export class UnknownComponent extends BaseComponent implements OnInit {
  constructor(private readonly store: Store, private readonly ticket: TicketService) {
    super();
  }

  /** Init hook. */
  public ngOnInit(): void {
    this.handleRouting();
  }

  private handleRouting(): void {
    this.ticket.getForzaTitle$().subscribe(title => {
      this.routeByTitle(title);
    });
  }

  /** Routes to the appropriate title page. */
  private routeByTitle(title: GameTitleCodeName): Observable<void> {
    switch (title) {
      case GameTitleCodeName.Street:
        return this.store.dispatch(new Navigate(['/ticket-app/title/gravity'], null, { skipLocationChange: true }));
      case GameTitleCodeName.FH4:
        return this.store.dispatch(new Navigate(['/ticket-app/title/sunrise'], null, { skipLocationChange: true }));
      case GameTitleCodeName.FM7:
        return this.store.dispatch(new Navigate(['/ticket-app/title/apollo'], null, { skipLocationChange: true }));
      case GameTitleCodeName.FH3:
        return this.store.dispatch(new Navigate(['/ticket-app/title/opus'], null, { skipLocationChange: true }));
    }
  }
}
