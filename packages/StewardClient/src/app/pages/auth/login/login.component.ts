import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
import { WindowService } from '@services/window';
import { EmailAddresses } from '@shared/constants';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { RecheckAuth } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

/** This component redirects to AAD logout, if possible. Otherwise it opens itself in a new tab (where it is possible). */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public error: unknown;

  private redirectToRoute: string;
  public EmailAddresses = EmailAddresses;

  constructor(
    private readonly msalService: MsalService,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly logger: LoggerService,
    private readonly windowService: WindowService,
  ) {}

  /** OnInit hook. */
  public ngOnInit(): void {
    this.redirectToRoute = this.route.snapshot.queryParamMap.get('from') ?? '/';
    this.logger.debug([LogTopic.Auth], `Redirect to Route: ${this.redirectToRoute}`);
    this.login$();
  }

  /** Launches the login popup. */
  public async login$(): Promise<void> {
    const location = this.windowService.location();
    const useStaging =
      this.store.selectSnapshot<boolean>(UserSettingsState.enableStagingApi) &&
      location?.origin === environment.stewardUiStagingUrl;
    try {
      await this.msalService
        .loginPopup({
          scopes: [environment.azureAppScope],
          redirectUri: `${
            useStaging ? environment.stewardUiStagingUrl : environment.stewardUiUrl
          }/auth/aad-login`,
        })
        .toPromise();

      await this.store.dispatch(new RecheckAuth()).toPromise();

      const profile = await UserState.latestValidProfile$(this.profile$).toPromise();
      if (!profile) {
        this.error = 'Profile not found. Please try again.';
        return;
      }

      this.store.dispatch(new Navigate([this.redirectToRoute]));
    } catch (error) {
      this.logger.debug([LogTopic.Auth], `Login: Error`, error);
      this.error = error;
    }
  }
}
