import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import {
  RequestAccessToken,
  ResetUserProfile,
} from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

/** Defines the auth component. */
@Component({
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})
export class AuthComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public fromApp: string;
  public loading: boolean;
  public inZendesk: boolean;
  public profile: UserModel;
  public aadRedirect: boolean;
  public loggedOut: boolean;
  public autoCloseTimeSecsLeft: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store,
    private msalService: MsalService,
    private windowService: WindowService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.fromApp = params.from;

      if(params.action === 'login') this.login();
      if(params.action === 'logout') this.logout();
    });
    this.activatedRoute.data.subscribe(data => {
        this.aadRedirect = data.from === 'aad';
        this.loggedOut = data.from === 'logout';
    })
  }

  /** Logic for the OnInit componet lifecycle */
  public ngOnInit() {
    this.loading = true;
    this.inZendesk = !!this.windowService.zafClient();
    UserState.latestValidProfile(this.profile$).subscribe(
      profile => {
        this.loading = false;
        this.profile = profile;

        if (!!this.profile && this.inZendesk) {
          this.router.navigate([`/${this.fromApp}`]);
        } else if(!!this.profile && this.aadRedirect) {
          this.autoCloseWindow(10);
        } else if(!this.profile && this.loggedOut) {
          this.autoCloseWindow(10);
        }
      },
      () => {
        this.loading = false;
        this.profile = null;
        if(this.loggedOut) this.autoCloseWindow(10);
      }
    );
  }

  /** Open the auth page in a new tab. */
  public loginWithNewTab() {
    this.windowService.open(`${environment.clientUrl}/auth?action=login`, '_blank');
  }

  /** Sends login request to client app scope. */
  public login() {
    this.msalService.loginRedirect({
      extraScopesToConsent: [environment.azureAppScope],
      redirectUri: `${environment.clientUrl}/auth/aad`
    });
  }

  /** Logs out of all signed in app scopes. */
  public logout() {
    this.msalService.logout();
  }

  /** Rechecks if user is authorized with the app. */
  public recheckAuth() {
    this.store.dispatch(new ResetUserProfile());
    this.store.dispatch(new RequestAccessToken());
    this.ngOnInit();
  }

  /**  Starts a timer on UI that will autoclose the window */
  public autoCloseWindow(timerSecsLeft: number) {
    this.autoCloseTimeSecsLeft = timerSecsLeft;
    setTimeout(() => {
      const secondsLeft = this.autoCloseTimeSecsLeft - 1;
      secondsLeft === 0
        ? this.windowService.close()
        : this.autoCloseWindow(secondsLeft);
    }, 1000)
  }
}
