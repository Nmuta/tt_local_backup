import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
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

  public enableFakeApi: boolean;
  public enableStagingApi: boolean;
  public showFakeApiToggle: boolean; // Only show on dev or if user is a live ops admin
  public showStagingApiToggle: boolean; // Only show on staging slot

  constructor(private readonly store: Store, private readonly windowService: WindowService) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.showFakeApiToggle = profile.role === UserRole.LiveOpsAdmin || !environment.production;

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
}
