import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { Clipboard } from '@helpers/clipboard';
import { UserRole } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import { BreakAccessToken, LogoutUser } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Defines the profile component. */
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public user: UserModel;
  public loading: boolean;
  public accessToken: string;

  public profileTabVisible = false;
  public showDevTools: boolean;

  public syncAuthUrl: string;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly windowService: WindowService,
    private readonly clipboard: Clipboard,
  ) {
    super();
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.accessToken = this.store.selectSnapshot<string | null | undefined>(UserState.accessToken);
    this.loading = true;

    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.user = profile;
          this.showDevTools = profile.role === UserRole.LiveOpsAdmin;
          this.syncAuthUrl = [
            `/auth/sync-state?accessToken=${this.accessToken}`,
            `emailAddress=${profile.emailAddress}`,
            `role=${profile.role}`,
            `name=${profile.name}`,
            `objectId=${profile.objectId}`,
          ].join('&');
        },
        _error => {
          this.loading = false;
        },
      );
  }

  /** Copys the state access token to clipboard */
  public copyAccessToken(): void {
    this.clipboard.copyMessage(this.accessToken);
  }

  /** Copys the sync path to the clipboard. */
  public copySyncPath(): void {
    this.clipboard.copyMessage(this.syncAuthUrl);
  }

  /** Opens the auth page in a new tab. */
  public logout(): void {
    this.store.dispatch(new LogoutUser(this.router.routerState.snapshot.url));
  }

  /** Breaks the user's access token. */
  public break(): void {
    this.store.dispatch(new BreakAccessToken());
  }

  /** Changes the profile tab visiblity. */
  public changeProfileTabVisibility(): void {
    this.profileTabVisible = !this.profileTabVisible;
  }
}
