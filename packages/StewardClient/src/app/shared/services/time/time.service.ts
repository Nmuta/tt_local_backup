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
   * return a static time config
   */
  public getLocalTimeConfig(): TimeConfig {
    return this.localTimeConfig;
  }

  /**
   * return and observable time config 
   */
  public getDynamicLocalTimeConfig(): Observable<UserSettingsStateModel> {
    return this.userSettings$;
  }


  /**
   * Take the time config set by the user in the experience tab of the side panel
   * and set that variable in the application state.
   */
  public setLocalTimeConfig(timeConfig: TimeConfig): void {
    this.localTimeConfig = timeConfig;
    this.store.dispatch(new SetTimeConfig(timeConfig));
  }
}
