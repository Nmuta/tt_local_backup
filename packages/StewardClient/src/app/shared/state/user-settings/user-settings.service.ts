import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, startWith } from 'rxjs';
import { SetAppVersion } from './user-settings.actions';
import { UserSettingsState, UserSettingsStateModel } from './user-settings.state';
import { environment } from '@environments/environment';

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
    const configuredAppVersion = this.state.appVersion;

    const appVersionIsUnconfigured = configuredAppVersion === environment.adoVersion;
    const isLocalhost = environment.stewardUiUrl.includes('localhost');
    if (isLocalhost && appVersionIsUnconfigured) {
      return 'localhost';
    }

    return configuredAppVersion;
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
