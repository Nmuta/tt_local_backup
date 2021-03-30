import { Component, OnInit } from '@angular/core';
import { CommunityAppTools, createCommunityNavbarPath } from '@community-app/community-tool-list';
import {
  createDataPipelineNavbarPath,
  DataPipelineAppTools,
} from '@data-pipeline-app/data-pipeline-tool-list';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { createLiveOpsNavbarPath, LiveOpsAppTools } from '@live-ops-app/live-ops-tool-list';
import { UserRole } from '@models/enums';
import { RouterLinkPath } from '@models/routing';
import { UserModel } from '@models/user.model';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';

/** A menu dropdown with links to all Steward Apps. */
@Component({
  selector: 'all-apps-dropdown',
  templateUrl: './all-apps-dropdown.component.html',
  styleUrls: ['./all-apps-dropdown.component.scss'],
})
export class AllAppsDropdownComponent implements OnInit {
  public moreAppsIcon = faEllipsisV;
  public allApps: RouterLinkPath[] = [
    createLiveOpsNavbarPath(LiveOpsAppTools.HomePage),
    createNavbarPath(NavbarTools.HomePage),
    createCommunityNavbarPath(CommunityAppTools.HomePage),
    createDataPipelineNavbarPath(DataPipelineAppTools.HomePage),
  ];

  public showAllAppsDropdown: boolean;

  constructor(protected readonly store: Store) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.showAllAppsDropdown = profile && profile.role === UserRole.LiveOpsAdmin;
  }
}
