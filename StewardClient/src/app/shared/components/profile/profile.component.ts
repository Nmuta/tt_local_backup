import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import {
  ResetAccessToken,
  ResetUserProfile,
} from '@shared/state/user/user.actions';

/** Defines the profile component. */
@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent {
  @Input() public user: UserModel;
  @Input() public parentApp: string;

  public profileTabVisible = false;

  constructor(
    protected router: Router,
    protected store: Store,
    protected windowService: WindowService,
  ) {}

  /** Opens the auth page in a new tab. */
  public logout(): void {
    this.store.dispatch(new ResetUserProfile());
    this.store.dispatch(new ResetAccessToken());
    this.router.navigate([`/auth`], { queryParams: { from: this.parentApp } });
    this.windowService.open(
      `${environment.stewardUiUrl}/auth?action=logout`,
      '_blank',
    );
  }

  /** Changes the profile tab visiblity. */
  public changeProfileTabVisibility(): void {
    this.profileTabVisible = !this.profileTabVisible;
  }
}
