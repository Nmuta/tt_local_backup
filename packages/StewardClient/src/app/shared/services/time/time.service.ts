import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetTimeConfig } from '@shared/state/user-settings/user-settings.actions';
import { TimeConfig } from '@shared/state/user-settings/user-settings.state';

/**
 *Manages time across the app.
 */
@Injectable({
  providedIn: 'root',
})
export class TimeService {
  localTimeConfig: TimeConfig = { zone: '', offset: '' };
  constructor(private store: Store) {}

  /**
   *convert local time to UTC time
   */
  public getLocalTimeConfig(): TimeConfig {
    return { zone: '', offset: '' };
  }

  /**
   *f
   */
  public setLocalTimeConfig(timeConfig: TimeConfig): void {
    this.localTimeConfig = timeConfig;
    this.store.dispatch(new SetTimeConfig(timeConfig));
  }
}
