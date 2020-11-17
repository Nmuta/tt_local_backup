import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faExclamationTriangle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { WindowService } from '@services/window';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { createNavbarPath, navbarToolList, NavbarTools, RouterLinkPath } from './navbar-tool-list';

/** The shared top-level navbar. */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public warningIcon = faExclamationTriangle;
  public refreshIcon = faSyncAlt;
  public items: RouterLinkPath[] = navbarToolList;
  public homeRouterLink = createNavbarPath(NavbarTools.HomePage).routerLink;

  public loading: boolean;
  public profile: UserModel;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly windowService: WindowService) {
    super();
  }

  public get missingZendesk(): boolean {
    return !this.windowService.zafClient();
  }

  public get location(): string {
    return `${window.location.pathname}${window.location.search}`;
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.profile = profile;
          if (!this.profile) {
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
}
