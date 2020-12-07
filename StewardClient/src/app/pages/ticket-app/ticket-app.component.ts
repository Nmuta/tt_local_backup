import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { TicketService } from '@services/zendesk/ticket.service';
import { UserModel } from '@shared/models/user.model';
import { ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
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

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.profile = profile;
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
}
