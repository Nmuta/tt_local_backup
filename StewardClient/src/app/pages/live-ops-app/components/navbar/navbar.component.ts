import { Component } from '@angular/core';
import { faExclamationTriangle, faInfoCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { WindowService } from '@services/window';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { RouterLinkPath } from '@models/routing';
import {
  createLiveOpsNavbarPath,
  liveOpsAppToolList,
  LiveOpsAppTools,
} from '@live-ops-app/live-ops-tool-list';

/** The shared top-level navbar. */
@Component({
  selector: 'live-ops-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class LiveOpsNavbarComponent {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public warningIcon = faExclamationTriangle;
  public refreshIcon = faSyncAlt;
  public infoIcon = faInfoCircle;
  public items: RouterLinkPath[] = liveOpsAppToolList;
  public homeRouterLink = createLiveOpsNavbarPath(LiveOpsAppTools.HomePage).routerLink;

  constructor(private readonly windowService: WindowService) {}

  /** A string representing the current location */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location().search}`;
  }
}
