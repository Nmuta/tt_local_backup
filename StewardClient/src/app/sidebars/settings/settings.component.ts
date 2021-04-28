import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { SetFakeApi, SetStagingApi } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { SetLiveOpsAdminSecondaryRole } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Component for handling user settings. */
@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  public activeRole: UserRole;
  public enableFakeApi: boolean;
  public enableStagingApi: boolean;
  public showRoleSelectionDropdown: boolean;
  public showFakeApiToggle: boolean; // Only show on dev or if user is a live ops admin
  public showStagingApiToggle: boolean; // Only show on staging slot

  public roleList: UserRole[] = [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.DataPipelineAdmin,
    UserRole.DataPipelineContributor,
    UserRole.DataPipelineRead,
    UserRole.CommunityManager,
  ];

  constructor(private readonly store: Store, private readonly windowService: WindowService) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profileForceTrueData); // Force true data so live ops admins can change their settings around
    this.showFakeApiToggle = profile.role === UserRole.LiveOpsAdmin || !environment.production;
    this.showRoleSelectionDropdown = profile.role === UserRole.LiveOpsAdmin;
    if (this.showRoleSelectionDropdown) {
      this.activeRole = !profile.liveOpsAdminSecondaryRole
        ? profile.role
        : profile.liveOpsAdminSecondaryRole;
    }

    const location = this.windowService.location();
    this.showStagingApiToggle = location?.origin === environment.stewardUiStagingUrl;

    this.settings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.enableFakeApi = latest.enableFakeApi;
      this.enableStagingApi = latest.enableStagingApi;
    });
  }

  /** Fired when any setting changes. */
  public syncFakeApiSettings(): void {
    this.store.dispatch(new SetFakeApi(this.enableFakeApi));
  }

  /** Fired when any setting changes. */
  public syncStagingApiSettings(): void {
    this.store.dispatch(new SetStagingApi(this.enableStagingApi));
  }

  /** Sets the new active role to the live ops secondary role in state profile. */
  public changeActiveRole($event: MatSelectChange): void {
    this.store.dispatch(new SetLiveOpsAdminSecondaryRole($event.value));
  }
}
