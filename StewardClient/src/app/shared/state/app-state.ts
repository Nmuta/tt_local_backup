import { UserSettingsStateModel } from './user-settings/user-settings.state';
import { UserStateModel } from './user/user.state';

/** Typings for state snapshot queries. */
export interface AppState {
  user: UserStateModel;
  userSettings: UserSettingsStateModel;
}
