import { Component } from '@angular/core';
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
import { RouterLinkPath } from '@models/routing';
import {
  communityAppToolList,
  CommunityAppTools,
  createCommunityNavbarPath,
} from '@community-app/community-tool-list';

/** The shared top-level navbar. */
@Component({
  selector: 'community-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class CommunityNavbarComponent {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public warningIcon = faExclamationTriangle;
  public refreshIcon = faSyncAlt;
  public infoIcon = faInfoCircle;
  public items: RouterLinkPath[] = communityAppToolList;
  public homeRouterLink = createCommunityNavbarPath(CommunityAppTools.HomePage).routerLink;

  public readonly profileIcon = faUser;
  public readonly settingsIcon = faCog;

  constructor(
    private readonly windowService: WindowService,
    public readonly zendeskService: ZendeskService,
  ) {}

  /** A string representing the current location */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location().search}`;
  }

  /** Emits true when we are missing zendesk. */
  public get missingZendesk$(): Observable<boolean> {
    return this.zendeskService.missingZendesk$;
  }
}
