import { TitleMemoryModel } from './title-memory/title-memory.model';
import { UserSettingsStateModel } from './user-settings/user-settings.state';
import { UserStateModel } from './user/user.state.model';
import { TourStateModel } from './tours/tours.state';

/** Typings for state snapshot queries. */
export interface AppState {
  user: UserStateModel;
  userSettings: UserSettingsStateModel;
  titleMemory: TitleMemoryModel;
  tour: TourStateModel;
}
