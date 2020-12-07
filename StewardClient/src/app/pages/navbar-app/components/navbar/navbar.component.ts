import { Component, OnInit } from '@angular/core';
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
import { first, map } from 'rxjs/operators';

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
export class NavbarComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public warningIcon = faExclamationTriangle;
  public refreshIcon = faSyncAlt;
  public infoIcon = faInfoCircle;
  public items: RouterLinkPath[] = navbarToolList;
  public homeRouterLink = createNavbarPath(NavbarTools.HomePage).routerLink;

  public profileIcon = faUser;
  public settingsIcon = faCog;
  public missingZendesk = false;

  constructor(
    private readonly windowService: WindowService,
    public readonly zendeskService: ZendeskService,
  ) {}

  /** True when the Zendesk Client is not available */
  public ngOnInit(): void {
    this.zendeskService.inZendesk$.subscribe(
      client => (this.missingZendesk = !client),
      _error => (this.missingZendesk = true),
    );
  }

  /** A string representing the current location */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location().search}`;
  }
}
