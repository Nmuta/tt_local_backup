import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, startWith } from 'rxjs';
import { SetAppVersion } from './user-settings.actions';
import { UserSettingsState, UserSettingsStateModel } from './user-settings.state';

/** Helper methods for handling User Settings State. */
@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  @Select(UserSettingsState)
  private readonly userSettingsState$: Observable<UserSettingsStateModel>;
  private state: UserSettingsStateModel;

  /** Produces the app version. */
  public get appVersion(): string {
    return this.state.appVersion;
  }

  /** Sets the app version. */
  public set appVersion(value: string) {
    this.store.dispatch(new SetAppVersion(value));
  }

  constructor(private readonly store: Store) {
    const snapshot = this.store.selectSnapshot<UserSettingsStateModel>(UserSettingsState);
    this.userSettingsState$.pipe(startWith(snapshot)).subscribe(state => (this.state = state));
  }
}
