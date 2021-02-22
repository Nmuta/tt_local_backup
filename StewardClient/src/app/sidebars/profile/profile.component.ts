import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { environment } from '@environments/environment';
import { Clipboard } from '@helpers/clipboard';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import { LogoutUser } from '@shared/state/user/user.actions';
import { UserState, USER_STATE_NOT_FOUND } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Defines the profile component. */
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel | USER_STATE_NOT_FOUND>;

  public profile: UserModel | USER_STATE_NOT_FOUND;

  /** Returns the found user or undefined. */
  public get user(): UserModel { return this.profile === UserState.NOT_FOUND ? undefined : this.profile; }

  public loading: boolean;
  public isDevEnvironment: boolean;
  public accessToken: string;

  public profileTabVisible = false;

  constructor(
    protected router: Router,
    protected store: Store,
    protected windowService: WindowService,
    protected clipboard: Clipboard,
  ) {
    super();
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.isDevEnvironment = !environment.production;
    this.accessToken = this.store.selectSnapshot<string | null | undefined>(UserState.accessToken);
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

  /** Copys the state access token to clipboard */
  public copyAccessToken(): void {
    this.clipboard.copyMessage(this.accessToken);
  }

  /** Opens the auth page in a new tab. */
  public logout(): void {
    this.store.dispatch(new LogoutUser(this.router.routerState.snapshot.url));
  }

  /** Changes the profile tab visiblity. */
  public changeProfileTabVisibility(): void {
    this.profileTabVisible = !this.profileTabVisible;
  }
}
