import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import { SetAppVersion, SetFakeApi } from './user-settings.actions';

/** Defines the user state model. */
export class UserSettingsStateModel {
  public enableFakeApi: boolean;
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

  /** Sets the state of the current app version. */
  @Action(SetAppVersion, { cancelUncompleted: true })
  public setAppVersion(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetAppVersion,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ appVersion: clone(action.version) }));
  }

  /** Selector for state app version. */
  @Selector()
  public static appVersion(state: UserSettingsStateModel): string {
    return state.appVersion;
  }
}
