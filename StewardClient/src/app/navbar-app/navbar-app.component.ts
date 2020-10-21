import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

/** Root component for primary app, navigated to from navigation sidebar. */
@Component({
  templateUrl: './navbar-app.html',
  styleUrls: ['./navbar-app.scss'],
})
export class NavbarAppComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public titles = ['🦆', '🦆', '🦢'];

  public appName = 'navbar-app';
  public loading: boolean;
  public profile: UserModel;

  constructor(private router: Router) {}

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit() {
    this.loading = true;
    UserState.latestValidProfile(this.profile$).subscribe(
      profile => {
        this.loading = false;
        this.profile = profile;
        if (!this.profile) {
          this.router.navigate([`/auth`], {
            queryParams: { from: this.appName },
          });
        }
      },
      error => {
        this.loading = false;
        this.router.navigate([`/auth`], {
          queryParams: { from: this.appName },
        });
      }
    );
  }
}
