import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { TicketService } from '@services/zendesk/ticket.service';
import { UserModel } from '@shared/models/user.model';
import { ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Coordination component for for ticket-app. */
@Component({
  templateUrl: './ticket-app.component.html',
  styleUrls: ['./ticket-app.component.scss'],
})
export class TicketAppComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public loading: boolean;
  public profile: UserModel;

  constructor(
    private readonly store: Store,
    private readonly zendesk: ZendeskService,
    private readonly ticket: TicketService,
  ) {
    super();
  }

  /** Access layer for html to check again code name enum. */
  public get gameTitleCodeNames(): typeof GameTitleCodeName {
    return GameTitleCodeName;
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.profile = profile;
          this.handleRouting();
        },
        _error => {
          this.loading = false;
        },
      );
  }

  /** Logic for the AfterViewInit component lifecycle. */
  public ngAfterViewInit(): void {
    this.zendesk.resize$('100%', '500px').subscribe();
  }

  /** Opens up inventory app with predefined info filled out. */
  public goToInventory(): void {
    const appSection = this.gameTitle + '/' + this.xuid;
    this.zendesk.goToApp$('nav_bar', 'forza-inventory-support', appSection).subscribe();
  }

  private async handleRouting(): Promise<void> {
    const title = await this.ticket.getForzaTitle$().toPromise();

    this.routeByTitle(title);
  }

  /** Routes to the appropriate title page. */
  private routeByTitle(title: GameTitleCodeName): Observable<void> {
    switch(title) {
      case GameTitleCodeName.Street:
        return this.store.dispatch(new Navigate(['/ticket-app/title/gravity']))
      case GameTitleCodeName.FH4:
        return this.store.dispatch(new Navigate(['/ticket-app/title/sunrise']))
      case GameTitleCodeName.FM7:
        return this.store.dispatch(new Navigate(['/ticket-app/title/apollo']))
      case GameTitleCodeName.FH3:
        return this.store.dispatch(new Navigate(['/ticket-app/title/opus']))
    }
  }
}
