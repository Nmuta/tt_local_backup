import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SetTimeConfig } from '@shared/state/user-settings/user-settings.actions';
import { TimeConfig, UserSettingsState, UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { Observable, take } from 'rxjs';

/**
 *Manages time across the app.
 */
@Injectable({
  providedIn: 'root',
})
export class TimeService {
  @Select(UserSettingsState) public userSettings$: Observable<UserSettingsStateModel>;
  
  localTimeConfig: TimeConfig = { zone: '', offset: '' };
  constructor(private store: Store) {
    this.userSettings$.pipe(take(1)).subscribe(latest => {
      this.localTimeConfig = latest.timeConfiguration;
    });
  }

  /**
   *convert local time to UTC time
   */
  public getLocalTimeConfig(): TimeConfig {
    // eslint-disable-next-line no-console
    console.log('getting the local time config', this.localTimeConfig)
    return this.localTimeConfig;
  }

  /**
   *f
   */
  public setLocalTimeConfig(timeConfig: TimeConfig): void {
    this.localTimeConfig = timeConfig;
    this.store.dispatch(new SetTimeConfig(timeConfig));
  }
}
