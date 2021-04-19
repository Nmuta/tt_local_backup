import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import { SetAppVersion, SetStagingApi, SetFakeApi } from './user-settings.actions';

/** Defines the user state model. */
export class UserSettingsStateModel {
  public enableFakeApi: boolean;
  public enableStagingApi: boolean;
  public appVersion: string;
}

/** Defines the current users' settings. */
@Injectable({
  providedIn: 'root',
})
@State<Partial<UserSettingsStateModel>>({
  name: 'userSettings',
  defaults: {
    enableFakeApi: !environment.production,
    enableStagingApi: false,
    appVersion: undefined,
  },
})
export class UserSettingsState {
  /** Sets the state of the current API. */
  @Action(SetFakeApi, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetFakeApi,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ enableFakeApi: clone(action.enabled) }));
  }

  /** Sets the state of the current API. */
  @Action(SetStagingApi, { cancelUncompleted: true })
  public setStagingApi(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetStagingApi,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ enableStagingApi: clone(action.enabled) }));
  }

  /** Sets the state of the current app version. */
  @Action(SetAppVersion, { cancelUncompleted: true })
  public setAppVersion(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetAppVersion,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ appVersion: clone(action.version) }));
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
