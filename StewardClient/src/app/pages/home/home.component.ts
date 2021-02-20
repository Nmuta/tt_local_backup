import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

/** Displays the home page splash page. */
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit {
  public userProfile: UserModel;

  public areSupportAppsAccessible: boolean = false;
  public areDataAppsAccessible: boolean = false;

  public availableIcon = faCheckCircle;
  public unavailableIcon = faTimesCircle;

  public appAvailableTooltip = 'App is available to your role.';
  public appUnavailableTooltip = 'App is unavailable to your role.';

  constructor(protected readonly store: Store) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userProfile = this.store.selectSnapshot<UserModel>(UserState.profile);

    if (!!this.userProfile) {
      switch (this.userProfile.role) {
        case UserRole.LiveOpsAdmin:
          this.areSupportAppsAccessible = true;
          this.areDataAppsAccessible = true;
          break;
        case UserRole.SupportAgentAdmin:
        case UserRole.SupportAgent:
        case UserRole.SupportAgentNew:
          this.areSupportAppsAccessible = true;
          break;
        case UserRole.DataPipelineAdmin:
        case UserRole.DataPipelineContributor:
        case UserRole.DataPipelineRead:
          this.areSupportAppsAccessible = false;
          break;
      }
    }
  }
}
