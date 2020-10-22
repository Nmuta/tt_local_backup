import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  navbarAppRootPath,
  NavbarPath,
  navbarToolList,
} from './navbar-tool-list';

/** The shared top-level navbar. */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public items: NavbarPath[] = navbarToolList;
  public homeRouterLink = [navbarAppRootPath];

  public loading: boolean;
  public profile: UserModel;

  constructor(private readonly router: Router) {
    super();
  }

  public get location(): string {
    return window.location.pathname;
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit() {
    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.profile = profile;
          if (!this.profile) {
            this.router.navigate([`/auth`], {
              queryParams: { from: this.location },
            });
          }
        },
        _error => {
          this.loading = false;
          this.router.navigate([`/auth`], {
            queryParams: { from: this.location },
          });
        }
      );
  }
}
