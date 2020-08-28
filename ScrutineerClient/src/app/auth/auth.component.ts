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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store,
    private msalService: MsalService,
    private windowService: WindowService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.fromApp = params.from;
    });
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
        }
      },
      () => {
        this.loading = false;
        this.profile = null;
      }
    );
  }

  /** Open the auth page in a new tab. */
  public openAuthPageInNewTab() {
    this.windowService.open(`${environment.clientUrl}/auth`, '_blank');
  }

  /** Sends login request to client app scope. */
  public login() {
    this.msalService.loginRedirect({
      extraScopesToConsent: [environment.azureAppScope],
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
}
