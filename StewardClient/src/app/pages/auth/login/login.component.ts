import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
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

  constructor(
    private readonly msalService: MsalService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly logger: LoggerService,
  ) {}

  /** OnInit hook. */
  public ngOnInit(): void {
    this.redirectToRoute = this.route.snapshot.queryParamMap.get('from') ?? '/';
    this.logger.debug([LogTopic.Auth], `Redirect to Route: ${this.redirectToRoute}`);
    this.login$();
  }

  /** Launches the login popup. */
  public async login$(): Promise<void> {
    try {
      this.logger.debug([LogTopic.Auth], `Attempting login`);
      const response = await this.msalService.loginPopup({
        extraScopesToConsent: [environment.azureAppScope],
      });
      this.logger.debug([LogTopic.Auth], `After login: Success`, response);

      this.logger.debug([LogTopic.Auth], `Rechecking Auth`);
      const response2 = await this.store.dispatch(new RecheckAuth()).toPromise();
      this.logger.debug([LogTopic.Auth], `Rechecked Auth: Success`, response2);

      this.logger.debug([LogTopic.Auth], `Getting latest profile`);
      const profile = await UserState.latestValidProfile$(this.profile$).toPromise();
      this.logger.debug([LogTopic.Auth], `Latest Profile`, profile);

      if (!profile) {
        this.error = 'Profile not found. Please try again.';
        return;
      }

      this.router.navigate([this.redirectToRoute]);
    } catch (error) {
      this.logger.debug([LogTopic.Auth], `Login: Error`, error);
      this.error = error;
    }
  }
}
