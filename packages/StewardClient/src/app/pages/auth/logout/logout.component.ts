import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
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
    private readonly msalService: MsalService,
    private readonly windowService: WindowService,
    private readonly store: Store,
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
        new WindowOpen(`${window.origin}/auth/logout`, '_blank'),
        new Navigate([`/auth/logout-iframe`]),
      ]);
    }
  }
}
