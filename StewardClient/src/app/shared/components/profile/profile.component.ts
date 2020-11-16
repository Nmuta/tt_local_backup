import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import { LogoutUser } from '@shared/state/user/user.actions';

/** Defines the profile component. */
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
    this.store.dispatch(new LogoutUser(this.parentApp));
  }

  /** Changes the profile tab visiblity. */
  public changeProfileTabVisibility(): void {
    this.profileTabVisible = !this.profileTabVisible;
  }
}
