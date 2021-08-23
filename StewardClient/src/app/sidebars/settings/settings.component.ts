import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import {
  ApolloEndpointKey,
  SteelheadEndpointKey,
  SunriseEndpointKey,
  UserRole,
  WoodstockEndpointKey,
} from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import {
  SetApolloEndpointKey,
  SetFakeApi,
  SetStagingApi,
  SetSteelheadEndpointKey,
  SetSunriseEndpointKey,
  SetWoodstockEndpointKey,
} from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { SetLiveOpsAdminSecondaryRole } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { keys } from 'lodash';
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
  public apolloEndpointKey: ApolloEndpointKey;
  public sunriseEndpointKey: SunriseEndpointKey;
  public woodstockEndpointKey: WoodstockEndpointKey;
  public steelheadEndpointKey: SteelheadEndpointKey;
  public showRoleSelectionDropdown: boolean;
  public showFakeApiToggle: boolean; // Only show on dev or if user is a live ops admin
  public showStagingApiToggle: boolean; // Only show on staging slot

  public roleList: UserRole[] = keys(UserRole).map(key => UserRole[key]);
  public apolloEndpointKeyList: ApolloEndpointKey[] = keys(ApolloEndpointKey).map(
    key => ApolloEndpointKey[key],
  );
  public sunriseEndpointKeyList: SunriseEndpointKey[] = keys(SunriseEndpointKey).map(
    key => SunriseEndpointKey[key],
  );
  public woodstockEndpointKeyList: SunriseEndpointKey[] = keys(WoodstockEndpointKey).map(
    key => WoodstockEndpointKey[key],
  );
  public steelheadEndpointKeyList: SunriseEndpointKey[] = keys(SteelheadEndpointKey).map(
    key => SteelheadEndpointKey[key],
  );

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
      this.apolloEndpointKey = latest.apolloEndpointKey;
      this.sunriseEndpointKey = latest.sunriseEndpointKey;
      this.woodstockEndpointKey = latest.woodstockEndpointKey;
      this.steelheadEndpointKey = latest.steelheadEndpointKey;
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

  /** Fired when any setting changes. */
  public syncApolloEndpointKey($event: MatSelectChange): void {
    this.store.dispatch(new SetApolloEndpointKey($event.value)).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Fired when any setting changes. */
  public syncSunriseEndpointKey($event: MatSelectChange): void {
    this.store.dispatch(new SetSunriseEndpointKey($event.value)).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Fired when any setting changes. */
  public syncWoodstockEndpointKey($event: MatSelectChange): void {
    this.store.dispatch(new SetWoodstockEndpointKey($event.value)).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Fired when any setting changes. */
  public syncSteelheadEndpointKey($event: MatSelectChange): void {
    this.store.dispatch(new SetSteelheadEndpointKey($event.value)).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Sets the new active role to the live ops secondary role in state profile. */
  public changeActiveRole($event: MatSelectChange): void {
    this.store.dispatch(new SetLiveOpsAdminSecondaryRole($event.value)).subscribe(() => {
      this.windowService.location().reload();
    });
  }
}
