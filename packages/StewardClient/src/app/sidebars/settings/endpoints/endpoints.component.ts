import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { GameTitle, UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { WindowService } from '@services/window';
import { InvalidPermActionType } from '@shared/modules/permissions/directives/permission-attribute.base.directive';
import {
  EndpointKeyMemoryState,
  EndpointKeyMemoryModel,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { TourState, TourStateModel } from '@shared/state/tours/tours.state';
import {
  SetFakeApi,
  SetApolloEndpointKey,
  SetSunriseEndpointKey,
  SetWoodstockEndpointKey,
  SetForteEndpointKey,
  SetSteelheadEndpointKey,
} from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { Observable, filter, takeUntil } from 'rxjs';

/** Controls settings relating to Endpoints. */
@Component({
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss'],
})
export class EndpointsComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState) public userSettings$: Observable<UserSettingsStateModel>;
  @Select(EndpointKeyMemoryState) public endpointKeys$: Observable<EndpointKeyMemoryModel>;
  @Select(TourState) public tourState$: Observable<TourStateModel>;

  public enableFakeApi: boolean;
  public apolloEndpointKey: string;
  public sunriseEndpointKey: string;
  public woodstockEndpointKey: string;
  public steelheadEndpointKey: string;
  public forteEndpointKey: string;
  public showFakeApiToggle: boolean; // Only show on dev or if user is a live ops admin

  public apolloEndpointKeyList: string[];
  public sunriseEndpointKeyList: string[];
  public woodstockEndpointKeyList: string[];
  public steelheadEndpointKeyList: string[];
  public forteEndpointKeyList: string[];

  public InvalidPermActionType = InvalidPermActionType;
  public PermAttributeName = PermAttributeName;
  public GameTitle = GameTitle;

  constructor(private readonly store: Store, private readonly windowService: WindowService) {
    super();
  }
  /** Initialization hook. */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profileForceTrueData); // Force true data so live ops admins can change their settings around
    this.showFakeApiToggle = profile.role === UserRole.LiveOpsAdmin || !environment.production;

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
      this.enableFakeApi = latest.enableFakeApi;
      this.apolloEndpointKey = latest.apolloEndpointKey;
      this.sunriseEndpointKey = latest.sunriseEndpointKey;
      this.woodstockEndpointKey = latest.woodstockEndpointKey;
      this.steelheadEndpointKey = latest.steelheadEndpointKey;
      this.forteEndpointKey = latest.forteEndpointKey;
    });
  }

  /** Fired when any setting changes. */
  public syncFakeApiSettings(): void {
    this.store.dispatch(new SetFakeApi(this.enableFakeApi));
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
}
