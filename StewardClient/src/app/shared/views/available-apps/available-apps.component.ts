import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';

/** Displays the apps available to the user, or a login button. */
@Component({
  selector: 'available-apps',
  templateUrl: './available-apps.component.html',
  styleUrls: ['./available-apps.component.scss'],
})
export class AvailableAppsComponent extends BaseComponent implements OnInit {
  public userProfile: UserModel;

  public areLiveOpsAppsAccessible: boolean = false;
  public areSupportAppsAccessible: boolean = false;
  public areDataAppsAccessible: boolean = false;
  public areCommunityAppsAccessible: boolean = false;

  public availableIcon = faCheckCircle;
  public unavailableIcon = faTimesCircle;

  public appAvailableTooltip = 'App is available to your role.';
  public appUnavailableTooltip = 'App is unavailable to your role.';

  constructor(private readonly store: Store) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userProfile = this.store.selectSnapshot<UserModel>(UserState.profile);

    if (!!(this.userProfile as UserModel)?.role) {
      const role = (this.userProfile as UserModel).role;
      switch (role) {
        case UserRole.LiveOpsAdmin:
          this.areLiveOpsAppsAccessible = true;
          this.areSupportAppsAccessible = true;
          this.areDataAppsAccessible = true;
          this.areCommunityAppsAccessible = true;
          break;
        case UserRole.SupportAgentAdmin:
        case UserRole.SupportAgent:
        case UserRole.SupportAgentNew:
          this.areSupportAppsAccessible = true;
          break;
        case UserRole.DataPipelineAdmin:
        case UserRole.DataPipelineContributor:
        case UserRole.DataPipelineRead:
          this.areDataAppsAccessible = true;
          break;
        case UserRole.CommunityManager:
          this.areCommunityAppsAccessible = true;
          break;
      }
    }
  }
}
