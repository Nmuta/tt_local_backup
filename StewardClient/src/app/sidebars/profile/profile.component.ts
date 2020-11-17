import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import { LogoutUser } from '@shared/state/user/user.actions';
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

  public profileTabVisible = false;

  constructor(
    protected router: Router,
    protected store: Store,
    protected windowService: WindowService,
  ) {
    super();
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.user = profile;
          if (!this.user) {
            // TODO: NO REDIRECT
            // this.router.navigate([`/auth`], {
            //   queryParams: { from: this.location },
            // });
          }
        },
        _error => {
          this.loading = false;
          // TODO: NO REDIRECT
          // this.router.navigate([`/auth`], {
          //   queryParams: { from: this.location },
          // });
        },
      );
  }

  /** Opens the auth page in a new tab. */
  public logout(): void {
    this.store.dispatch(new LogoutUser('navbar-app'));
  }

  /** Changes the profile tab visiblity. */
  public changeProfileTabVisibility(): void {
    this.profileTabVisible = !this.profileTabVisible;
  }
}
