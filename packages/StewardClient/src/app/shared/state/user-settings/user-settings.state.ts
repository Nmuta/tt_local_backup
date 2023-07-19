import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment, NavbarTool } from '@environments/environment';
import { InitEndpointKeysError } from '@models/enums';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { cloneDeep } from 'lodash';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { InitEndpointKeys } from '../endpoint-key-memory/endpoint-key-memory.actions';
import { EndpointKeyMemoryState } from '../endpoint-key-memory/endpoint-key-memory.state';
import {
  SetAppVersion,
  SetStagingApi,
  SetFakeApi,
  SetNavbarTools,
  SetApolloEndpointKey,
  SetSunriseEndpointKey,
  SetWoodstockEndpointKey,
  SetSteelheadEndpointKey,
  VerifyEndpointKeyDefaults,
  ConfigureAppUpdatePopup,
  SetThemeOverride,
  ThemeOverrideOptions,
  ThemeEnvironmentWarningOptions,
  SetThemeEnvironmentWarning,
  RefreshEndpointKeys,
  SetForteEndpointKey,
  ConfigureShowVerifyCheckboxPopup,
} from './user-settings.actions';

/** Defines the user state model. */
export class UserSettingsStateModel {
  public enableFakeApi: boolean;
  public enableStagingApi: boolean;
  public appVersion: string;
  public showAppUpdatePopup: boolean;
  public showVerifyCheckboxPopup: boolean;
  public apolloEndpointKey: string;
  public sunriseEndpointKey: string;
  public woodstockEndpointKey: string;
  public steelheadEndpointKey: string;
  public forteEndpointKey: string;
  public forumEndpointKey: string;
  public navbarTools: Partial<Record<NavbarTool, number>>;
  public themeOverride: ThemeOverrideOptions;
  public themeEnvironmentWarning: ThemeEnvironmentWarningOptions;
}

/** Defines the current users' settings. */
@State<UserSettingsStateModel>({
  name: 'userSettings',
  defaults: {
    enableFakeApi: false,
    enableStagingApi: false,
    appVersion: undefined,
    navbarTools: {},
    apolloEndpointKey: undefined,
    sunriseEndpointKey: undefined,
    woodstockEndpointKey: undefined,
    steelheadEndpointKey: undefined,
    forteEndpointKey: undefined,
    forumEndpointKey: undefined,
    showAppUpdatePopup: true,
    showVerifyCheckboxPopup: true,
    themeOverride: undefined,
    themeEnvironmentWarning: !environment.production ? 'warn' : undefined,
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserSettingsState {
  constructor(private readonly store: Store, private readonly snackbar: MatSnackBar) {}
  /** Sets the state of the current API. */
  @Action(SetFakeApi, { cancelUncompleted: true })
  public setFakeApi$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetFakeApi,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ enableFakeApi: action.enabled }));
  }

  /** Sets the state of the current API. */
  @Action(SetStagingApi, { cancelUncompleted: true })
  public setStagingApi$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetStagingApi,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ enableStagingApi: action.enabled }));
  }

  /** Sets the state of the current app version. */
  @Action(SetAppVersion, { cancelUncompleted: true })
  public setAppVersion$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetAppVersion,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ appVersion: action.version }));
  }

  /** Sets the state of whether the app update popup should show. */
  @Action(ConfigureAppUpdatePopup, { cancelUncompleted: true })
  public setShowAppUpdatePopup$(
    ctx: StateContext<UserSettingsStateModel>,
    action: ConfigureAppUpdatePopup,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ showAppUpdatePopup: action.show }));
  }

  /** Sets the state of whether the verify checkbox popup should show. */
  @Action(ConfigureShowVerifyCheckboxPopup, { cancelUncompleted: true })
  public setShowVerifyCheckboxPopup$(
    ctx: StateContext<UserSettingsStateModel>,
    action: ConfigureAppUpdatePopup,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ showVerifyCheckboxPopup: action.show }));
  }

  /** Sets the navbar tool list. */
  @Action(SetNavbarTools, { cancelUncompleted: true })
  public setNavbarTools$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetNavbarTools,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ navbarTools: action.navbarTools }));
  }

  /** Sets the theme override. */
  @Action(SetThemeOverride, { cancelUncompleted: true })
  public setThemeOverride$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetThemeOverride,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ themeOverride: action.themeOverride }));
  }

  /** Sets the theme override. */
  @Action(SetThemeEnvironmentWarning, { cancelUncompleted: true })
  public setThemeEnvironmentWarning$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetThemeEnvironmentWarning,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ themeEnvironmentWarning: action.themeEnvironmentWarning }));
  }

  /** Sets the state of the current Apollo endpoint key. */
  @Action(SetApolloEndpointKey, { cancelUncompleted: true })
  public setApolloEndpointKey$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetApolloEndpointKey,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ apolloEndpointKey: action.apolloEndpointKey }));
  }

  /** Sets the state of the current Sunrise endpoint key. */
  @Action(SetSunriseEndpointKey, { cancelUncompleted: true })
  public setSunriseEndpointKey$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetSunriseEndpointKey,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ sunriseEndpointKey: action.sunriseEndpointKey }));
  }

  /** Sets the state of the current Woodstock endpoint key. */
  @Action(SetWoodstockEndpointKey, { cancelUncompleted: true })
  public setWoodstockEndpointKey$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetWoodstockEndpointKey,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ woodstockEndpointKey: action.woodstockEndpointKey }));
  }

  /** Sets the state of the current Forte endpoint key. */
  @Action(SetForteEndpointKey, { cancelUncompleted: true })
  public setForteEndpointKey$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetForteEndpointKey,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ woodstockEndpointKey: action.forteEndpointKey }));
  }

  /** Sets the state of the current Steelhead endpoint key. */
  @Action(SetSteelheadEndpointKey, { cancelUncompleted: true })
  public setSteelheadEndpointKey$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetSteelheadEndpointKey,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ steelheadEndpointKey: action.steelheadEndpointKey }));
  }

  /** Forces re-retrieval and sync of endpoint keys. */
  @Action(RefreshEndpointKeys, { cancelUncompleted: true })
  public refreshEndpointKeys$(
    _ctx: StateContext<RefreshEndpointKeys>,
    _action: RefreshEndpointKeys,
  ): Observable<UserSettingsStateModel> {
    this.snackbar.open('Re-verifying endpoint selection', 'Dismiss', {
      panelClass: 'snackbar-info',
      duration: 3_000,
    });

    return this.store.dispatch(new InitEndpointKeys()).pipe(
      switchMap(() => this.store.dispatch(new VerifyEndpointKeyDefaults())),
      catchError((error: InitEndpointKeysError) => {
        switch (error) {
          case InitEndpointKeysError.LookupFailed:
            this.snackbar.open('Endpoint key lookup failed.', 'Dismiss', {
              panelClass: 'snackbar-warn',
            });
            break;

          case InitEndpointKeysError.SelectionRemoved:
            this.snackbar.open('Restored endpoints to default', 'Dismiss', {
              panelClass: 'snackbar-info',
            });
            break;
          default:
        }

        // NGXS store now has correct values, but local storage did not update due to thrown error
        // Retrigger verify so local storage is updated accordingly
        return this.store.dispatch(new VerifyEndpointKeyDefaults());
      }),
    );
  }

  /** Sets the state of the current endpoint key selections. */
  @Action(VerifyEndpointKeyDefaults, { cancelUncompleted: true })
  public verifyEndpointKeyDefaults$(
    ctx: StateContext<UserSettingsStateModel>,
    _action: VerifyEndpointKeyDefaults,
  ): Observable<UserSettingsStateModel> {
    const state = cloneDeep(ctx.getState());

    const apolloEndpointKeys = this.store.selectSnapshot<string[]>(
      EndpointKeyMemoryState.apolloEndpointKeys,
    );
    const sunriseEndpointKeys = this.store.selectSnapshot<string[]>(
      EndpointKeyMemoryState.sunriseEndpointKeys,
    );
    const woodstockEndpointKeys = this.store.selectSnapshot<string[]>(
      EndpointKeyMemoryState.woodstockEndpointKeys,
    );
    const steelheadEndpointKeys = this.store.selectSnapshot<string[]>(
      EndpointKeyMemoryState.steelheadEndpointKeys,
    );
    const forteEndpointKeys = this.store.selectSnapshot<string[]>(
      EndpointKeyMemoryState.forteEndpointKeys,
    );
    const forumEndpointKeys = this.store.selectSnapshot<string[]>(
      EndpointKeyMemoryState.forumEndpointKeys,
    );

    const isValidEndpointSelection = {
      apollo: apolloEndpointKeys.includes(state.apolloEndpointKey),
      sunrise: sunriseEndpointKeys.includes(state.sunriseEndpointKey),
      woodstock: woodstockEndpointKeys.includes(state.woodstockEndpointKey),
      steelhead: steelheadEndpointKeys.includes(state.steelheadEndpointKey),
      forte: forteEndpointKeys.includes(state.forteEndpointKey),
      forum: forumEndpointKeys.includes(state.forumEndpointKey),
    };

    //First endpoint key returned by API is the default, clear out any state values for endpoints that no longer exist.
    state.apolloEndpointKey = isValidEndpointSelection.apollo
      ? state.apolloEndpointKey
      : apolloEndpointKeys[0];
    state.sunriseEndpointKey = isValidEndpointSelection.sunrise
      ? state.sunriseEndpointKey
      : sunriseEndpointKeys[0];
    state.woodstockEndpointKey = isValidEndpointSelection.woodstock
      ? state.woodstockEndpointKey
      : woodstockEndpointKeys[0];
    state.steelheadEndpointKey = isValidEndpointSelection.steelhead
      ? state.steelheadEndpointKey
      : steelheadEndpointKeys[0];
    state.forteEndpointKey = isValidEndpointSelection.forte
      ? state.forteEndpointKey
      : forteEndpointKeys[0];
    state.forumEndpointKey = isValidEndpointSelection.forum
      ? state.forumEndpointKey
      : forumEndpointKeys[0];

    ctx.setState(state);

    if (
      !isValidEndpointSelection.apollo ||
      !isValidEndpointSelection.sunrise ||
      !isValidEndpointSelection.woodstock ||
      !isValidEndpointSelection.steelhead ||
      !isValidEndpointSelection.forte ||
      !isValidEndpointSelection.forum
    ) {
      return throwError(InitEndpointKeysError.SelectionRemoved);
    }

    return of(state);
  }

  /** Selector for whether the state has fake api enabled. */
  @Selector()
  public static enableFakeApi(state: UserSettingsStateModel): boolean {
    return state.enableFakeApi;
  }

  /** Selector for whether the state has staging api enabled. */
  @Selector()
  public static enableStagingApi(state: UserSettingsStateModel): boolean {
    return state.enableStagingApi;
  }

  /** Selector for state app version. */
  @Selector()
  public static appVersion(state: UserSettingsStateModel): string {
    return state.appVersion;
  }

  /** Selector for state show app update popupe. */
  @Selector()
  public static showAppUpdatePopup(state: UserSettingsStateModel): boolean {
    return state.showAppUpdatePopup;
  }

  /** Selector for state show verify checkbox popup. */
  @Selector()
  public static showVerifyCheckboxPopup(state: UserSettingsStateModel): boolean {
    if (state.showVerifyCheckboxPopup === undefined) {
      return true;
    }

    return state.showVerifyCheckboxPopup;
  }

  /** Selector for app's apollo endpoint. */
  @Selector()
  public static apolloEndpointKey(state: UserSettingsStateModel): string {
    return state.apolloEndpointKey;
  }

  /** Selector for app's sunrise endpoint. */
  @Selector()
  public static sunriseEndpointKey(state: UserSettingsStateModel): string {
    return state.sunriseEndpointKey;
  }

  /** Selector for app's woodstock endpoint. */
  @Selector()
  public static woodstockEndpointKey(state: UserSettingsStateModel): string {
    return state.woodstockEndpointKey;
  }

  /** Selector for app's steelhead endpoint. */
  @Selector()
  public static steelheadEndpointKey(state: UserSettingsStateModel): string {
    return state.steelheadEndpointKey;
  }

  /** Selector for app's forte endpoint. */
  @Selector()
  public static forteEndpointKey(state: UserSettingsStateModel): string {
    return state.forteEndpointKey;
  }

  /** Selector for app's forte endpoint. */
  @Selector()
  public static forumEndpointKey(state: UserSettingsStateModel): string {
    return state.forumEndpointKey;
  }
}
