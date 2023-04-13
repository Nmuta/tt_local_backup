import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { RecheckAuth } from '@shared/state/user/user.actions';

/** Displays the apps available to the user, or a login button. */
@Component({
  selector: 'available-apps',
  templateUrl: './available-apps.component.html',
  styleUrls: ['./available-apps.component.scss'],
})
export class AvailableAppsComponent extends BaseComponent implements OnInit, DoCheck {
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public userProfile: UserModel;

  public areAnyAppsAccessible: boolean = false;
  public areZendeskAppsAccessible: boolean = false;

  public availableIcon = faCheckCircle;
  public unavailableIcon = faTimesCircle;

  public appAvailableTooltip = 'App is available to your role.';
  public appUnavailableTooltip = 'App is unavailable to your role.';

  public enableStagingApi: boolean;
  public showStagingApiToggle: boolean; // Only show on prod and if user is a live ops admin

  private shouldReloadData = false;

  public readonly UserRole = UserRole;

  constructor(
    private readonly store: Store,
    private readonly windowService: WindowService,
    private readonly router: Router,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.configure(this.store.selectSnapshot<UserModel>(UserState.profile));

    this.router.events.subscribe(_ => {
      if (!this.shouldReloadData) {
        this.shouldReloadData = true;
      }
    });

    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(userProfile => {
        this.configure(userProfile);
      });
  }

  /** Angular lifecycle hook. */
  public ngDoCheck(): void {
    if (this.shouldReloadData) {
      this.shouldReloadData = false;
      this.configure(this.store.selectSnapshot<UserModel>(UserState.profile));
    }
  }

  /** Fired when any setting changes. */
  public syncStagingApiSettings(): void {
    this.store.dispatch(new SetStagingApi(this.enableStagingApi));
  }

  /** Refresh the user role */
  public refreshLoginToken(): void {
    this.store
      .dispatch(new RecheckAuth())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_ => {
        this.configure(this.store.selectSnapshot<UserModel>(UserState.profile));
      });
  }

  private configure(userProfile: UserModel): void {
    this.userProfile = userProfile;
    const location = this.windowService.location();
    this.showStagingApiToggle = location?.origin === environment.stewardUiStagingUrl;

    this.settings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.enableStagingApi = latest.enableStagingApi;
    });

    const role = this.userProfile?.role ?? UserRole.None;
    this.areAnyAppsAccessible = role !== UserRole.None;

    this.areZendeskAppsAccessible =
      role === UserRole.LiveOpsAdmin ||
      role === UserRole.GeneralUser
  }
}
