import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetFakeApi } from './user-settings.actions';

/** Defines the user state model. */
export class UserSettingsStateModel {
  public enableFakeApi: boolean;
}

@Injectable({
  providedIn: 'root',
})
@State<Partial<UserSettingsStateModel>>({
  name: 'userSettings',
  defaults: {
    enableFakeApi: true,
  },
})
export class UserSettingsState {
  /** Sets the state of the current API. */
  @Action(SetFakeApi, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<UserSettingsStateModel>,
    action: SetFakeApi,
  ): Observable<UserSettingsStateModel> {
    return of(ctx.patchState({ enableFakeApi: action.enabled }));
  }
}
