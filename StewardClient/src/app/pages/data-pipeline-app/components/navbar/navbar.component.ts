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
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { RouterLinkPath } from '@models/routing';
import {
  createDataPipelineNavbarPath,
  dataPipelineAppToolList,
  DataPipelineAppTools,
} from '@data-pipeline-app/data-pipeline-tool-list';

/** The shared top-level navbar. */
@Component({
  selector: 'data-pipeline-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class DataPipelineNavbarComponent {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public warningIcon = faExclamationTriangle;
  public refreshIcon = faSyncAlt;
  public infoIcon = faInfoCircle;
  public items: RouterLinkPath[] = dataPipelineAppToolList;
  public homeRouterLink = createDataPipelineNavbarPath(DataPipelineAppTools.HomePage).routerLink;

  public readonly profileIcon = faUser;
  public readonly settingsIcon = faCog;

  constructor(private readonly windowService: WindowService) {}

  /** A string representing the current location */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location().search}`;
  }
}
