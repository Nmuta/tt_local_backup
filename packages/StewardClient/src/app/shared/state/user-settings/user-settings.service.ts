import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, startWith } from 'rxjs';
import { SetAppVersion } from './user-settings.actions';
import { UserSettingsState, UserSettingsStateModel } from './user-settings.state';
import { environment } from '@environments/environment';
import { DateTime } from 'luxon';

/** Helper methods for handling User Settings State. */
@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  @Select(UserSettingsState)
  private readonly userSettingsState$: Observable<UserSettingsStateModel>;
  private state: UserSettingsStateModel;

  /**
   * Produces the current app version.
   * As seen in environment.ts and configured by ADO build pipeline.
   * 
   * When on localhost, produces hourly versions.
   */
  public get currentAppVersion(): string {
    const appVersionIsUnconfigured = 'ADO_VERSION_TO_REPLACE' === environment.adoVersion;
    const isLocalhost = window.origin.includes('localhost');
    if (isLocalhost && appVersionIsUnconfigured) {
      return 'localhost-' + DateTime.now().toFormat('yyyy.MM.dd:HH');
    }

    return environment.adoVersion;
  }

  /** Produces the app version. */
  public get lastSeenAppVersion(): string {
     return this.state.appVersion;
  }

  /** Sets the app version. */
  public set lastSeenAppVersion(value: string) {
    this.store.dispatch(new SetAppVersion(value));
  }

  constructor(private readonly store: Store) {
    const snapshot = this.store.selectSnapshot<UserSettingsStateModel>(UserSettingsState);
    this.userSettingsState$.pipe(startWith(snapshot)).subscribe(state => (this.state = state));
  }
}
