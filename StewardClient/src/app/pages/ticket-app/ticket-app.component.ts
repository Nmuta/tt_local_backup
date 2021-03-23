import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StewardAppBaseComponent } from '../steward-app.base.component';

/** Coordination component for for ticket-app. */
@Component({
  templateUrl: './ticket-app.component.html',
  styleUrls: ['./ticket-app.component.scss'],
})
export class TicketAppComponent extends StewardAppBaseComponent implements OnInit, AfterViewInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public loading: boolean;
  public profile: UserModel;

  constructor(
    protected readonly zendesk: ZendeskService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
  ) {
    super(router, route);
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    super.ngOnInit();

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
