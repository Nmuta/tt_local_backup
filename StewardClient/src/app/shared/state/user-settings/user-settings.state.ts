import { Injectable } from '@angular/core';
import { environment, NavbarTool } from '@environments/environment';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetAppVersion, SetStagingApi, SetFakeApi, SetNavbarTools } from './user-settings.actions';

/** Defines the user state model. */
export class UserSettingsStateModel {
  public enableFakeApi: boolean;
  public enableStagingApi: boolean;
  public appVersion: string;
  public navbarTools: Partial<Record<NavbarTool, number>>;
}

/** Defines the current users' settings. */
@Injectable({
  providedIn: 'root',
})
@State<UserSettingsStateModel>({
  name: 'userSettings',
  defaults: {
    enableFakeApi: !environment.production,
    enableStagingApi: false,
    appVersion: undefined,
    navbarTools: {},
  },
})
export class UserSettingsState {
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

  /** Sets the state of the current app version. */
  @Action(SetNavbarTools, { cancelUncompleted: true })
  public setNavbarTools$(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetNavbarTools,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ navbarTools: action.navbarTools }));
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
}
