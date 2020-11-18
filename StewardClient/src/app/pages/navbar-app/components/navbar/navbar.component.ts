import { Component } from '@angular/core';
import { faExclamationTriangle, faInfoCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { WindowService } from '@services/window';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

import { createNavbarPath, navbarToolList, NavbarTools, RouterLinkPath } from '../../navbar-tool-list';

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

  constructor(private readonly windowService: WindowService) {}

  public get missingZendesk(): boolean {
    return !this.windowService.zafClient();
  }

  public get location(): string {
    return `${window.location.pathname}${window.location.search}`;
  }
}
