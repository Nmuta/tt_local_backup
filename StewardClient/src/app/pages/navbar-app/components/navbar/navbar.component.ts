import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCog,
  faExclamationTriangle,
  faInfoCircle,
  faSyncAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { WindowService } from '@services/window';
import { ZendeskService } from '@services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

import {
  createNavbarPath,
  navbarToolList,
  NavbarTools,
  RouterLinkPath,
} from '../../navbar-tool-list';

/** The shared top-level navbar. */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public warningIcon = faExclamationTriangle;
  public refreshIcon = faSyncAlt;
  public infoIcon = faInfoCircle;
  public items: RouterLinkPath[] = navbarToolList;
  public homeRouterLink = createNavbarPath(NavbarTools.HomePage).routerLink;

  public readonly profileIcon = faUser;
  public readonly settingsIcon = faCog;

  constructor(
    protected readonly router: Router,
    protected readonly windowService: WindowService,
    protected readonly zendeskService: ZendeskService,
  ) {}

  /** A string representing the current location */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location().search}`;
  }

  /** Emits true when we are missing zendesk. */
  public get missingZendesk$(): Observable<boolean> {
    return this.zendeskService.missingZendesk$;
  }

  /** Routes based on the provided router link path. */
  public routeTo(routerLinkPath: RouterLinkPath): void {
    // Required here so that navigation extas can be used
    this.router.navigate(routerLinkPath.routerLink, routerLinkPath.navigationExtras);
  }
}
