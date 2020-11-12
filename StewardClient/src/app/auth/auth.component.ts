import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Select, Store } from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
import { BaseComponent } from '@shared/components/base-component/base-component.component';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import {
  RequestAccessToken,
  ResetUserProfile,
} from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { interval, Observable } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

/** Defines the auth component. */
@Component({
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})
export class AuthComponent extends BaseComponent implements OnInit, OnDestroy {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public fromApp: string;
  public loading: boolean;
  public inZendesk: boolean;

  public profile: UserModel;

  public fromAadLogin: boolean;
  public fromAadLogout: boolean;

  public autoCloseTimeSecsLeft: number;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly logger: LoggerService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly msalService: MsalService,
    private readonly windowService: WindowService
  ) {
    super();

    this.activatedRoute.queryParams.subscribe(params => {
      this.fromApp = params.from;

      if (params.action === 'login') this.login();
      if (params.action === 'logout') this.logout();
    });
    this.activatedRoute.params.subscribe(params => {
      this.fromAadLogin = params.value === 'aadLogin';
      this.fromAadLogout = params.value === 'aadLogout';
    });
  }

  /** Logic for the OnInit componet lifecycle */
  public ngOnInit(): void {
    this.loading = true;
    this.inZendesk = !!this.windowService.zafClient();
    UserState.latestValidProfile$(this.profile$).subscribe(
      profile => {
        this.loading = false;
        this.profile = profile;

        if (!!this.profile && this.inZendesk) {
          this.router.navigate([`/${this.fromApp}`]);
        }

        if (
          (!!this.profile && this.fromAadLogin) ||
          (!this.profile && this.fromAadLogout)
        ) {
          this.autoCloseWindow(10);
        }
      },
      () => {
        this.loading = false;
        this.profile = null;
        if (this.fromAadLogout) this.autoCloseWindow(10);
      }
    );
  }

  /** Open the auth page in a new tab. */
  public loginWithNewTab(): void {
    const newWindow = this.windowService.open(
      `${environment.stewardUiUrl}/auth?action=login`,
      '_blank'
    );

    // This isn't a great way to detect it, but I tried using the event system and the events for this sort of event just don't emit properly.
    // (a single child window can have multipe "onunload" events)
    interval(100)
      .pipe(
        takeUntil(this.onDestroy$),
        tap(() =>
          this.logger.log(
            [LogTopic.Auth],
            `polling; newWindow.closed == ${newWindow.closed}`
          )
        ),
        filter(() => newWindow.closed),
        take(1),
        tap(() =>
          this.logger.log(
            [LogTopic.Auth],
            `polling; newWindow.closed completed`
          )
        )
      )
      .subscribe(() => this.recheckAuth());
  }

  /** Sends login request to client app scope. */
  public login(): void {
    this.msalService.loginRedirect({
      extraScopesToConsent: [environment.azureAppScope],
    });
  }

  /** Logs out of all signed in app scopes. */
  public logout(): void {
    this.msalService.logout();
  }

  /** Rechecks if user is authorized with the app. */
  public recheckAuth(): void {
    this.store.dispatch(new ResetUserProfile());
    this.store.dispatch(new RequestAccessToken());
    this.ngOnInit();
  }

  /**  Starts a timer on UI that will autoclose the window */
  public autoCloseWindow(timerSecsLeft: number): void {
    this.autoCloseTimeSecsLeft = timerSecsLeft;
    setTimeout(() => {
      const secondsLeft = this.autoCloseTimeSecsLeft - 1;
      secondsLeft === 0
        ? this.windowService.close()
        : this.autoCloseWindow(secondsLeft);
    }, 1000);
  }
}
