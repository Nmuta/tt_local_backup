import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { WindowOpen } from '@services/window/window.actions';
import { ResetUserProfile } from '@shared/state/user/user.actions';

/** Handles the logout auth action. */
@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(
    public readonly msalService: MsalService,
    public readonly windowService: WindowService,
    public readonly store: Store,
  ) {}

  /** OnInit hook. */
  public ngOnInit(): void {
    this.logout();
  }

  /** Immediately logs out the user. */
  public logout(): void {
    if (!this.windowService.isInIframe) {
      this.msalService.logout();
      this.store.dispatch(new ResetUserProfile());
    } else {
      this.store.dispatch([
        new WindowOpen(`${environment.stewardUiUrl}/auth/logout`, '_blank'),
        new Navigate([`/auth/logout-iframe`]),
      ]);
    }
  }
}
