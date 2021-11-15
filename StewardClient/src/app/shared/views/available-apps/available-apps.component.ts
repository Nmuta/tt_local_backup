import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { SetStagingApi } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Displays the apps available to the user, or a login button. */
@Component({
  selector: 'available-apps',
  templateUrl: './available-apps.component.html',
  styleUrls: ['./available-apps.component.scss'],
})
export class AvailableAppsComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  public userProfile: UserModel;

  public areAnyAppsAccessible: boolean = false;
  public areZendeskAppsAccessible: boolean = false;

  public availableIcon = faCheckCircle;
  public unavailableIcon = faTimesCircle;

  public appAvailableTooltip = 'App is available to your role.';
  public appUnavailableTooltip = 'App is unavailable to your role.';

  public enableStagingApi: boolean;
  public showStagingApiToggle: boolean; // Only show on prod and if user is a live ops admin

  constructor(private readonly store: Store, private readonly windowService: WindowService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userProfile = this.store.selectSnapshot<UserModel>(UserState.profile);
    const location = this.windowService.location();
    this.showStagingApiToggle = location?.origin === environment.stewardUiStagingUrl;

    this.settings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.enableStagingApi = latest.enableStagingApi;
    });

    if (!!(this.userProfile as UserModel)?.role) {
      const role = (this.userProfile as UserModel).role;
      switch (role) {
        case UserRole.LiveOpsAdmin:
          this.areAnyAppsAccessible = true;
          this.areZendeskAppsAccessible = true;
          break;
        case UserRole.SupportAgentAdmin:
        case UserRole.SupportAgent:
        case UserRole.SupportAgentNew:
          this.areAnyAppsAccessible = true;
          this.areZendeskAppsAccessible = true;
          break;
        case UserRole.DataPipelineAdmin:
        case UserRole.DataPipelineContributor:
        case UserRole.DataPipelineRead:
          this.areAnyAppsAccessible = true;
          break;
        case UserRole.CommunityManager:
          this.areAnyAppsAccessible = true;
          break;
      }
    }
  }

  /** Fired when any setting changes. */
  public syncStagingApiSettings(): void {
    this.store.dispatch(new SetStagingApi(this.enableStagingApi));
  }
}
