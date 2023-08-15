import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { GameTitle, UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { Router } from '@angular/router';
import { WindowService } from '@services/window';
import { InvalidPermActionType } from '@shared/modules/permissions/directives/permission-attribute.base.directive';
import {
  EndpointKeyMemoryModel,
  EndpointKeyMemoryState,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import {
  ConfigureShowVerifyCheckboxPopup,
  SetApolloEndpointKey,
  SetFakeApi,
  SetForteEndpointKey,
  SetStagingApi,
  SetSteelheadEndpointKey,
  SetSunriseEndpointKey,
  SetWoodstockEndpointKey,
} from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { ApplyProfileOverrides } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { keys } from 'lodash';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserTourService } from '@tools-app/pages/home/tour/tour.service';
import { SetHomeTour, SetUserTours } from '@shared/state/tours/tours.actions';
import { TourState, TourStateModel } from '@shared/state/tours/tours.state';

/** Component for handling user settings. */
@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState) public userSettings$: Observable<UserSettingsStateModel>;
  @Select(EndpointKeyMemoryState) public endpointKeys$: Observable<EndpointKeyMemoryModel>;
  @Select(TourState) public tourState$: Observable<TourStateModel>;

  public guestAccountStatus: undefined | boolean = undefined;
  public activeRole: UserRole;
  public enableFakeApi: boolean;
  public enableStagingApi: boolean;
  public apolloEndpointKey: string;
  public sunriseEndpointKey: string;
  public woodstockEndpointKey: string;
  public steelheadEndpointKey: string;
  public forteEndpointKey: string;
  public showVerifyCheckboxPopup: boolean;
  public showProfileOverrideOptions: boolean;
  public showFakeApiToggle: boolean; // Only show on dev or if user is a live ops admin
  public showStagingApiToggle: boolean; // Only show on staging slot

  public roleList: UserRole[] = keys(UserRole).map(key => UserRole[key]);
  public apolloEndpointKeyList: string[];
  public sunriseEndpointKeyList: string[];
  public woodstockEndpointKeyList: string[];
  public steelheadEndpointKeyList: string[];
  public forteEndpointKeyList: string[];

  public InvalidPermActionType = InvalidPermActionType;
  public PermAttributeName = PermAttributeName;
  public GameTitle = GameTitle;

  public enableHomeTour: boolean;
  public enableUserTours: boolean;

  constructor(
    private readonly store: Store, 
    private readonly windowService: WindowService, 
    private readonly router: Router,
    private readonly userTourService: UserTourService,    // loaded here so tours will run
  ) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profileForceTrueData); // Force true data so live ops admins can change their settings around
    this.showFakeApiToggle = profile.role === UserRole.LiveOpsAdmin || !environment.production;
    this.showProfileOverrideOptions = profile.role === UserRole.LiveOpsAdmin;
    if (this.showProfileOverrideOptions) {
      this.activeRole = profile.overrides?.role;
      this.guestAccountStatus = profile.overrides?.isMicrosoftEmail;
    }

    const location = this.windowService.location();
    this.showStagingApiToggle = location?.origin === environment.stewardUiStagingUrl;

    this.endpointKeys$
      .pipe(
        filter(latest => {
          return (
            latest.Apollo.length > 0 &&
            latest.Sunrise.length > 0 &&
            latest.Woodstock.length > 0 &&
            latest.Forte.length > 0 &&
            latest.Steelhead.length > 0
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(latest => {
        this.apolloEndpointKeyList = latest.Apollo;
        this.sunriseEndpointKeyList = latest.Sunrise;
        this.woodstockEndpointKeyList = latest.Woodstock;
        this.steelheadEndpointKeyList = latest.Steelhead;
        this.forteEndpointKeyList = latest.Forte;
      });

    this.userSettings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.showVerifyCheckboxPopup = latest.showVerifyCheckboxPopup;
      this.enableFakeApi = latest.enableFakeApi;
      this.enableStagingApi = latest.enableStagingApi;
      this.apolloEndpointKey = latest.apolloEndpointKey;
      this.sunriseEndpointKey = latest.sunriseEndpointKey;
      this.woodstockEndpointKey = latest.woodstockEndpointKey;
      this.steelheadEndpointKey = latest.steelheadEndpointKey;
      this.forteEndpointKey = latest.forteEndpointKey;
    });

    this.tourState$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.enableHomeTour = latest.enableHomeTour;
      this.enableUserTours = latest.enableUserTours;
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
  public syncForteEndpointKey($event: MatSelectChange): void {
    this.store.dispatch(new SetForteEndpointKey($event.value)).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Fired when any setting changes. */
  public syncSteelheadEndpointKey($event: MatSelectChange): void {
    this.store.dispatch(new SetSteelheadEndpointKey($event.value)).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Fired when any setting changes. */
  public syncHomeTour(): void {
    this.store.dispatch(new SetHomeTour(this.enableHomeTour));
    this.router
      .navigate(['app', 'tools', 'home'])
      .then(() => { this.userTourService.homeTourStart(); });
  }
  
  /** Fired when any setting changes. */
  public syncUserTours(): void {
    this.store.dispatch(new SetUserTours(this.enableUserTours));
  }

  /** Sets the new active role to the live ops secondary role in state profile. */
  public changeActiveRole($event: MatSelectChange): void {
    this.store.dispatch(new ApplyProfileOverrides({ role: $event.value })).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Sets the new active role to the live ops secondary role in state profile. */
  public changeGuestAccountStatus($event: MatSelectChange): void {
    this.store
      .dispatch(new ApplyProfileOverrides({ isMicrosoftEmail: $event.value }))
      .subscribe(() => {
        this.windowService.location().reload();
      });
  }

  /** Sets the show verify checkbox popup value in settings. */
  public setShowVerifyCheckboxPopup(): void {
    this.store.dispatch(new ConfigureShowVerifyCheckboxPopup(this.showVerifyCheckboxPopup));
  }

  /** Sets the home tour boolean in settings. */
  public setHomeTour(): void {  
    this.store.dispatch(new SetHomeTour(true));
  }

  /** Sets all tour booleans in settings. */
  public setAllTours(): void {
    this.store.dispatch(new SetUserTours(!this.enableUserTours));
  }
}
