import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { navbarAppRootPath, NavbarPath, navbarToolList } from './navbar-tool-list';

/** The shared top-level navbar. */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public items: NavbarPath[] = navbarToolList;
  public homeRouterLink = [navbarAppRootPath];

  public profile: UserModel;

  public get location(): string { return window.location.pathname; }

  /** Initialization hook. */
  public ngOnInit() {
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(profile => this.profile = profile);
  }
}
